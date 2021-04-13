import React, { useEffect, useState } from 'react'
import { useHistory, useParams } from 'react-router-dom'
import { filter, isNil, map, size } from 'lodash'
import { getProfile } from 'services/user'
import SocialProfileCard from 'components/Common/Social/ProfileCard'
import { getPosts } from 'services/social/posts'
import { initPageItems, isFollowing, sortDescAndKeyPostId } from 'components/utils'
import SocialPostList from 'components/Common/Social/PostList'
import { useSelector } from 'react-redux'
import { DEFAULT_TIMEOUT, USER_TYPE_ENUM } from 'constants/constants'
import { Button, Empty } from 'antd'
import AboutCard from 'components/Profile/AboutCard'
import PersonalInformationCard from 'components/Profile/PersonalInformationCard'
import IndustryCard from 'components/Profile/IndustryCard'
import OccupationCard from 'components/Profile/OccupationCard'
import ExperienceCard from 'components/Profile/ExperienceCard'
import PersonalityCard from 'components/Profile/PersonalityCard'
import SocialFollowingList from 'components/Common/Social/FollowingList'
import { getFollowingList, getFollowerList } from 'services/social'
import ProfileBlockedCard from 'components/Common/Social/ProfileBlockedCard'
import ProfilePrivateCard from 'components/Common/Social/ProfilePrivateCard'
import { getMentorshipListings } from 'services/mentorship/listings'
import MentorshipListingCard from 'components/Mentorship/ShoppingListCard'
import { getCourses } from 'services/courses'
import CourseListingCard from 'components/Course/CourseListingCard'

const SocialProfile = () => {
  const user = useSelector(state => state.user)
  const social = useSelector(state => state.social)
  const history = useHistory()
  const { accountId } = useParams()

  if (!user.authorized) history.replace('/auth/login')

  const [viewUser, setViewUser] = useState('')
  const [isBlocked, setIsBlocked] = useState(false)

  const [posts, setPosts] = useState([])

  const [isLoading, setIsLoading] = useState(false)
  const [paginatedPosts, setPaginatedPosts] = useState([])
  const [currentPageIdx, setCurrentPageIdx] = useState(1)
  const [showLoadMore, setShowLoadMore] = useState(false)

  const [currentTab, setCurrentTab] = useState('socialfeed')
  const [followingList, setFollowingList] = useState([])
  const [followerList, setFollowerList] = useState([])
  const [mentorships, setMentorships] = useState([])
  const [courses, setCourses] = useState([])

  const changeCurrentTab = tabKey => {
    setCurrentTab(tabKey)
    if (tabKey === 'socialfeed') getPostsSvc(viewUser)
  }

  const amIFollowingThisUser = isFollowing(social.followingList, accountId)

  const getUserProfile = async () => {
    if (!isNil(accountId)) {
      const response = await getProfile(accountId)
      if (response) {
        setViewUser(response)
        if (!isNil(response.isBlocking)) setIsBlocked(response.isBlocking)
      }
      if (!response.isBlocking && (amIFollowingThisUser || !response.isPrivateProfile)) {
        getPostsSvc(response)
        getSocialInfo()
      }
    }
  }

  const getSocialInfo = async () => {
    if (!isNil(accountId)) {
      const followingRsp = await getFollowingList(accountId)
      if (followingRsp && !isNil(followingRsp.followingList))
        setFollowingList(followingRsp.followingList)
      const followerRsp = await getFollowerList(accountId)
      if (followerRsp && !isNil(followerRsp.followerList)) setFollowerList(followerRsp.followerList)
    }
  }

  const getPostsSvc = async userToGetPosts => {
    if (userToGetPosts && !isNil(userToGetPosts.accountId)) {
      const response = await getPosts(userToGetPosts.accountId)
      if (response && !isNil(response.listOfPost)) {
        const allPosts = sortDescAndKeyPostId(response.listOfPost)
        setPosts(allPosts)
        initPageItems(setIsLoading, allPosts, setPaginatedPosts, setCurrentPageIdx, setShowLoadMore)
      }
    }
  }

  const setLoadingIndicator = loading => {
    if (loading) setIsLoading(true)
    else {
      setTimeout(() => {
        setIsLoading(false)
      }, DEFAULT_TIMEOUT)
    }
  }

  const getMentorshipListingsSvc = async () => {
    setLoadingIndicator(true)
    const response = await getMentorshipListings()
    if (response && !isNil(response.mentorshipListings)) {
      const userMentorships = filter(response.mentorshipListings, listing => {
        return listing.accountId === accountId
      })
      setMentorships(userMentorships)
    }
    setLoadingIndicator(false)
  }

  const getCoursesSvc = async () => {
    setLoadingIndicator(true)
    const result = await getCourses()
    if (result && !isNil(result.courses)) {
      const userCourses = result.courses.filter(course => {
        return course.accountId === accountId
      })
      setCourses(userCourses)
    }
    setLoadingIndicator(false)
  }

  useEffect(() => {
    if (user.accountId === accountId)
      switch (user.userType) {
        case USER_TYPE_ENUM.SENSEI:
          history.replace(`/sensei/social/feed`)
          break
        case USER_TYPE_ENUM.STUDENT:
          history.replace(`/social/feed`)
          break
        default:
          break
      }
    getUserProfile()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [social])

  useEffect(() => {
    if (currentTab === 'mentorships') getMentorshipListingsSvc()
    if (currentTab === 'courses') getCoursesSvc()

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentTab])

  return (
    <div className="row">
      <div className="col-12 col-md-5">
        <SocialProfileCard
          user={viewUser}
          setCurrentTab={setCurrentTab}
          isBlocked={viewUser.isBlocking}
        />
        <div className="card">
          <div className="card-body">
            <Button
              block
              className={`${currentTab === 'socialfeed' ? 'btn btn-light' : 'btn'} border-0`}
              onClick={() => changeCurrentTab('socialfeed')}
              disabled={isBlocked || (!amIFollowingThisUser && viewUser.isPrivateProfile)}
              size="large"
              ref={button => button && button.blur()}
            >
              Social Feed
            </Button>
            <Button
              block
              className={`${currentTab === 'mentorships' ? 'btn btn-light' : 'btn'} border-0`}
              onClick={() => changeCurrentTab('mentorships')}
              disabled={isBlocked || (!amIFollowingThisUser && viewUser.isPrivateProfile)}
              size="large"
              ref={button => button && button.blur()}
            >
              Mentorships
            </Button>
            <Button
              block
              className={`${currentTab === 'courses' ? 'btn btn-light' : 'btn'} border-0`}
              onClick={() => changeCurrentTab('courses')}
              disabled={isBlocked || (!amIFollowingThisUser && viewUser.isPrivateProfile)}
              size="large"
              ref={button => button && button.blur()}
            >
              Courses
            </Button>
            <Button
              block
              className={`${currentTab === 'profile' ? 'btn btn-light' : 'btn'} border-0`}
              onClick={() => changeCurrentTab('profile')}
              disabled={isBlocked || (!amIFollowingThisUser && viewUser.isPrivateProfile)}
              size="large"
              ref={button => button && button.blur()}
            >
              Profile
            </Button>
            <Button
              block
              className={`${currentTab === 'achievements' ? 'btn btn-light' : 'btn'} border-0`}
              onClick={() => changeCurrentTab('achievements')}
              disabled={isBlocked || (!amIFollowingThisUser && viewUser.isPrivateProfile)}
              size="large"
              ref={button => button && button.blur()}
            >
              Achievements
            </Button>
          </div>
        </div>
      </div>
      <div className="col-12 col-md-7">
        {!amIFollowingThisUser && viewUser.isPrivateProfile && <ProfilePrivateCard />}
        {isBlocked && <ProfileBlockedCard />}
        {currentTab === 'socialfeed' &&
          !isBlocked &&
          (amIFollowingThisUser || !viewUser.isPrivateProfile) && (
            <SocialPostList
              user={user}
              isLoading={isLoading}
              setIsLoading={setIsLoading}
              posts={posts}
              setPosts={setPosts}
              paginatedPosts={paginatedPosts}
              setPaginatedPosts={setPaginatedPosts}
              currentPageIdx={currentPageIdx}
              setCurrentPageIdx={setCurrentPageIdx}
              showLoadMore={showLoadMore}
              setShowLoadMore={setShowLoadMore}
              btnSize="medium"
            />
          )}
        {currentTab === 'mentorships' && mentorships && (
          <div className="row">
            {size(mentorships) > 0 &&
              map(mentorships, l => {
                return (
                  <MentorshipListingCard
                    listing={l}
                    key={l.mentorshipListingId}
                    isLoading={isLoading}
                    className="col-12"
                  />
                )
              })}
            {size(mentorships) === 0 && (
              <div className="col-12 text-center">
                <Empty />
              </div>
            )}
          </div>
        )}
        {currentTab === 'courses' && courses && (
          <div className="row">
            {size(courses) > 0 &&
              map(courses, c => {
                return (
                  <CourseListingCard
                    key={c.courseId}
                    course={c}
                    isLoading={isLoading}
                    className="col-12 col-md-6"
                  />
                )
              })}
            {size(courses) === 0 && (
              <div className="col-12 text-center">
                <Empty />
              </div>
            )}
          </div>
        )}
        {currentTab === 'profile' && (
          <div>
            <PersonalInformationCard user={viewUser} />
            <AboutCard user={viewUser} />
            <IndustryCard user={viewUser} />
            <OccupationCard user={viewUser} />
            <ExperienceCard user={viewUser} />
            <PersonalityCard user={viewUser} />
          </div>
        )}
        {currentTab === 'following' && (
          <div className="card">
            <div className="card-header pb-2">
              <h3 className="font-weight-bold text-dark">Following</h3>
            </div>
            <div className="card-body">
              {size(followingList) > 0 && (
                <SocialFollowingList
                  followingList={followingList}
                  isOwnList={false}
                  isFollowingList
                />
              )}
              {size(followingList) === 0 && <Empty />}
            </div>
          </div>
        )}
        {currentTab === 'follower' && (
          <div className="card">
            <div className="card-header pb-2">
              <h3 className="font-weight-bold text-dark">Followers</h3>
            </div>
            <div className="card-body">
              {size(followerList) > 0 && (
                <SocialFollowingList
                  followingList={followerList}
                  isOwnList={false}
                  isFollowingList={false}
                />
              )}
              {size(followerList) === 0 && <Empty />}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default SocialProfile

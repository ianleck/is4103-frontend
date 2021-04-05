import React, { useEffect, useState } from 'react'
import { useHistory, useParams } from 'react-router-dom'
import { isNil } from 'lodash'
import { getProfile } from 'services/user'
import SocialProfileCard from 'components/Common/Social/ProfileCard'
import { getPosts } from 'services/social/posts'
import { initPageItems, sortDescAndKeyPostId } from 'components/utils'
import SocialPostList from 'components/Common/Social/PostList'
import { useSelector } from 'react-redux'
import { USER_TYPE_ENUM } from 'constants/constants'
import { Button } from 'antd'
import AboutCard from 'components/Profile/AboutCard'
import PersonalInformationCard from 'components/Profile/PersonalInformationCard'
import IndustryCard from 'components/Profile/IndustryCard'
import OccupationCard from 'components/Profile/OccupationCard'
import ExperienceCard from 'components/Profile/ExperienceCard'
import PersonalityCard from 'components/Profile/PersonalityCard'
import SocialFollowingList from 'components/Common/Social/FollowingList'
import { getFollowingList, getFollowerList } from 'services/social'

const SocialProfile = () => {
  const user = useSelector(state => state.user)
  const history = useHistory()
  const { accountId } = useParams()

  const [viewUser, setViewUser] = useState('')

  const [posts, setPosts] = useState([])

  const [isLoading, setIsLoading] = useState(false)
  const [paginatedPosts, setPaginatedPosts] = useState([])
  const [currentPageIdx, setCurrentPageIdx] = useState(1)
  const [showLoadMore, setShowLoadMore] = useState(false)

  const [currentTab, setCurrentTab] = useState('socialfeed')
  const [followingList, setFollowingList] = useState([])
  const [followerList, setFollowerList] = useState([])

  const changeCurrentTab = tabKey => {
    setCurrentTab(tabKey)
  }

  const getUserProfile = async () => {
    if (!isNil(accountId)) {
      const response = await getProfile(accountId)
      if (response) setViewUser(response)
      getPostsSvc(response)
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
    getSocialInfo()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div className="container">
      <div className="row">
        <div className="col-12 col-md-5">
          <SocialProfileCard user={viewUser} setCurrentTab={setCurrentTab} />
          <div className="card">
            <div className="card-body">
              <Button
                block
                className={`${currentTab === 'socialfeed' ? 'btn btn-light' : 'btn'} border-0`}
                onClick={() => changeCurrentTab('socialfeed')}
                size="large"
                ref={button => button && button.blur()}
              >
                Social Feed
              </Button>
              <Button
                block
                className={`${currentTab === 'profile' ? 'btn btn-light' : 'btn'} border-0`}
                onClick={() => changeCurrentTab('profile')}
                size="large"
                ref={button => button && button.blur()}
              >
                Profile
              </Button>
              <Button
                block
                className={`${currentTab === 'achievements' ? 'btn btn-light' : 'btn'} border-0`}
                onClick={() => changeCurrentTab('achievements')}
                size="large"
                ref={button => button && button.blur()}
              >
                Achievements
              </Button>
            </div>
          </div>
        </div>
        <div className="col-12 col-md-7">
          {currentTab === 'socialfeed' && (
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
            />
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
                <h3>Following</h3>
              </div>
              <div className="card-body">
                <SocialFollowingList
                  followingList={followingList}
                  isOwnList={false}
                  isFollowingList
                />
              </div>
            </div>
          )}
          {currentTab === 'follower' && (
            <div className="card">
              <div className="card-header pb-2">
                <h3>Followers</h3>
              </div>
              <div className="card-body">
                <SocialFollowingList
                  followingList={followerList}
                  isOwnList={false}
                  isFollowingList={false}
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default SocialProfile

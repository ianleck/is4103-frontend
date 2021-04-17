import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { useHistory } from 'react-router-dom'
import { getFollowingPosts } from 'services/social/posts'
import { isNil, size } from 'lodash'
import SocialProfileCard from 'components/Common/Social/ProfileCard'
import SocialAddPostCard from 'components/Common/Social/AddPostCard'
import { initPageItems, sortDescAndKeyPostId } from 'components/utils'
import SocialPostList from 'components/Common/Social/PostList'
import { Button, Empty } from 'antd'
import SocialFollowingList from 'components/Common/Social/FollowingList'
import AchievementCard from 'components/Common/Social/AchievementCard'

const SocialFeed = () => {
  const history = useHistory()
  const user = useSelector(state => state.user)
  const social = useSelector(state => state.social)
  const [posts, setPosts] = useState([])

  if (!user.authorized) history.replace('/auth/login')

  const [isLoading, setIsLoading] = useState(false)
  const [paginatedPosts, setPaginatedPosts] = useState([])
  const [currentPageIdx, setCurrentPageIdx] = useState(1)
  const [showLoadMore, setShowLoadMore] = useState(false)

  const [currentTab, setCurrentTab] = useState('socialfeed')

  useEffect(() => {
    getPostsSvc()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const getPostsSvc = async () => {
    if (user && !isNil(user.accountId)) {
      const response = await getFollowingPosts(user.accountId)
      if (response && !isNil(response.listOfPost)) {
        const allPosts = sortDescAndKeyPostId(response.listOfPost)
        setPosts(allPosts)
        initPageItems(setIsLoading, allPosts, setPaginatedPosts, setCurrentPageIdx, setShowLoadMore)
      }
    }
  }

  const TogglePageBtn = () => {
    return (
      <div className="card w-100">
        <div className="card-body">
          <Button
            block
            type={currentTab === 'socialfeed' ? 'primary' : 'default'}
            className={` border-0`}
            onClick={() => setCurrentTab('socialfeed')}
            size="large"
            ref={button => button && button.blur()}
          >
            Social Feed
          </Button>
          <Button
            block
            type={currentTab === 'achievements' ? 'primary' : 'default'}
            className={` border-0`}
            onClick={() => setCurrentTab('achievements')}
            size="large"
            ref={button => button && button.blur()}
          >
            Achievements
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div>
      <div className="row">
        <div className="col-12">
          <SocialProfileCard user={user} setCurrentTab={setCurrentTab} />
        </div>
        <div className="col-12 col-md-4 d-flex align-items-stretch">
          <TogglePageBtn />
        </div>
        <div className="col-12 col-md-8 d-flex align-items-stretch">
          <SocialAddPostCard user={user} getPostsSvc={getPostsSvc} />
        </div>
      </div>
      <div className="row">
        <div className="col-12">
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
              btnSize="medium"
            />
          )}
          {currentTab === 'achievements' && <AchievementCard user={user} />}
          {currentTab === 'following' && (
            <div className="card">
              <div className="card-header pb-2">
                <h3>Following</h3>
              </div>
              <div className="card-body">
                {size(social.followingList) > 0 && (
                  <SocialFollowingList
                    followingList={social.followingList}
                    isOwnList={false}
                    isFollowingList
                  />
                )}
                {size(social.followingList) === 0 && <Empty />}
              </div>
            </div>
          )}
          {currentTab === 'follower' && (
            <div className="card">
              <div className="card-header pb-2">
                <h3>Followers</h3>
              </div>
              <div className="card-body">
                {size(social.followerList) > 0 && (
                  <SocialFollowingList
                    followingList={social.followerList}
                    isOwnList={false}
                    isFollowingList={false}
                  />
                )}
                {size(social.followerList) === 0 && <Empty />}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default SocialFeed

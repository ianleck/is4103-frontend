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

const SenseiSocialProfile = () => {
  const user = useSelector(state => state.user)
  const history = useHistory()
  const { accountId } = useParams()

  const [viewUser, setViewUser] = useState('')

  const [posts, setPosts] = useState([])

  const [isLoading, setIsLoading] = useState(false)
  const [paginatedPosts, setPaginatedPosts] = useState([])
  const [currentPageIdx, setCurrentPageIdx] = useState(1)
  const [showLoadMore, setShowLoadMore] = useState(false)

  const getUserProfile = async () => {
    if (!isNil(accountId)) {
      const response = await getProfile(accountId)
      if (response) setViewUser(response)
      getPostsSvc(response)
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div className="container">
      <div className="row">
        <div className="col-12 col-md-5">
          <SocialProfileCard user={viewUser} />
        </div>
        <div className="col-12 col-md-7">
          <SocialPostList
            user={user}
            isLoading={isLoading}
            setIsLoading={setIsLoading}
            posts={posts}
            paginatedPosts={paginatedPosts}
            setPaginatedPosts={setPaginatedPosts}
            currentPageIdx={currentPageIdx}
            setCurrentPageIdx={setCurrentPageIdx}
            showLoadMore={showLoadMore}
            setShowLoadMore={setShowLoadMore}
          />
        </div>
      </div>
    </div>
  )
}

export default SenseiSocialProfile

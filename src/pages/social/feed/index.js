import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { getPosts } from 'services/social/posts'
import { isNil } from 'lodash'
import SocialProfileCard from 'components/Common/Social/ProfileCard'
import SocialAddPostCard from 'components/Common/Social/AddPostCard'
import { initPageItems, sortDescAndKeyPostId } from 'components/utils'
import SocialPostList from 'components/Common/Social/PostList'

const SocialFeed = () => {
  const user = useSelector(state => state.user)
  const [posts, setPosts] = useState([])

  const [isLoading, setIsLoading] = useState(false)
  const [paginatedPosts, setPaginatedPosts] = useState([])
  const [currentPageIdx, setCurrentPageIdx] = useState(1)
  const [showLoadMore, setShowLoadMore] = useState(false)

  useEffect(() => {
    getPostsSvc()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const getPostsSvc = async () => {
    if (user && !isNil(user.accountId)) {
      const response = await getPosts(user.accountId)
      if (response && !isNil(response.listOfPost)) {
        const allPosts = sortDescAndKeyPostId(response.listOfPost)
        setPosts(allPosts)
        initPageItems(setIsLoading, allPosts, setPaginatedPosts, setCurrentPageIdx, setShowLoadMore)
      }
    }
  }

  return (
    <div className="container">
      <div className="row">
        <div className="col-12 col-md-5">
          <SocialProfileCard user={user} />
        </div>
        <div className="col-12 col-md-7">
          <SocialAddPostCard user={user} getPostsSvc={getPostsSvc} />
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

export default SocialFeed

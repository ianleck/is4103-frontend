import React from 'react'
import { map, size } from 'lodash'
import PaginationWrapper from 'components/Common/Pagination'
import SocialPostListItem from './Item'

const SocialPostList = ({
  user,
  isLoading,
  setIsLoading,
  posts,
  paginatedPosts,
  setPaginatedPosts,
  currentPageIdx,
  setCurrentPageIdx,
  showLoadMore,
  setShowLoadMore,
}) => {
  return (
    <PaginationWrapper
      setIsLoading={setIsLoading}
      totalData={posts}
      paginatedData={paginatedPosts}
      setPaginatedData={setPaginatedPosts}
      currentPageIdx={currentPageIdx}
      setCurrentPageIdx={setCurrentPageIdx}
      showLoadMore={showLoadMore}
      setShowLoadMore={setShowLoadMore}
      buttonStyle="primary"
      wrapperContent={
        size(paginatedPosts) > 0 &&
        map(paginatedPosts, post => {
          return (
            <SocialPostListItem key={post.postId} post={post} user={user} isLoading={isLoading} />
          )
        })
      }
    />
  )
}

export default SocialPostList

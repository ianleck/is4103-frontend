import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { getPosts, likePost, unlikePost } from 'services/social/posts'
import { isNil, map, size } from 'lodash'
import { Avatar, Button, Skeleton } from 'antd'
import { CommentOutlined, LikeFilled, LikeOutlined } from '@ant-design/icons'
import SocialProfileCard from 'components/Common/Social/ProfileCard'
import SocialAddPostCard from 'components/Common/Social/AddPostCard'
import PaginationWrapper from 'components/Common/Pagination'
import { initPageItems, sortDescAndKeyPostId } from 'components/utils'
import moment from 'moment'
import { LIKE, UNLIKE } from 'constants/text'

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

  const PostListItem = ({ post }) => {
    const { Comment, LikePost } = post

    // eslint-disable-next-line no-unused-vars
    const [numComments, setNumComments] = useState(size(Comment))
    const [numLikePosts, setNumLikePosts] = useState(size(LikePost))

    const [isLiked, setIsLiked] = useState(
      size(LikePost.filter(o => o.accountId === user.accountId)) > 0,
    )

    const postAction = async (postId, type) => {
      if (type === 'like') {
        const response = await likePost(postId)
        if (response && response.success) {
          setIsLiked(true)
          setNumLikePosts(numLikePosts + 1)
        }
      } else {
        const response = await unlikePost(postId)
        if (response && response.success) {
          setIsLiked(false)
          setNumLikePosts(numLikePosts - 1)
        }
      }
    }

    return (
      <Skeleton active loading={isLoading}>
        <div className="card">
          <div className="card-header border-0">
            <div className="row align-items-center">
              <div className="col-auto">
                <Avatar
                  size="large"
                  src={
                    post.User?.profileImgUrl
                      ? `${post.User?.profileImgUrl}?${new Date().getTime()}`
                      : '/resources/images/avatars/avatar-2.png'
                  }
                />
              </div>
              <div className="col">
                <span>
                  {`${!isNil(post.User?.firstName) ? post.User?.firstName : 'Anonymous'} ${
                    !isNil(post.User?.lastName) ? post.User?.lastName : 'Pigeon'
                  }`}
                </span>
                <br />
                <small className="text-muted">{moment(post.createdAt).fromNow()}</small>
              </div>
            </div>
          </div>
          <div className="card-body pt-0 pb-0 description-body">{post.content}</div>
          <div className="card-footer border-0">
            <div className="row">
              <div className="col-6 col-md-4 col-lg-3 order-11 order-md-1">
                <Button
                  block
                  type={isLiked ? 'primary' : 'default'}
                  size="small"
                  icon={isLiked ? <LikeFilled /> : <LikeOutlined />}
                  onClick={() => postAction(post.postId, isLiked ? 'unlike' : 'like')}
                >
                  {isLiked ? UNLIKE : LIKE}
                </Button>
              </div>
              <div className="col-6 col-md-4 col-lg-3 order-12 order-md-2">
                <Button block type="default" size="small" icon={<CommentOutlined />}>
                  Comment
                </Button>
              </div>
              <div className="invisible-btn col-12 col-md text-left text-md-right mt-2 mb-3 mt-md-0 mb-md-0 order-1 order-md-12">
                {numLikePosts === 1 ? `${numLikePosts} like` : `${numLikePosts} likes`}
                {' • '}
                {numComments === 1 ? `${numComments} comment` : `${numComments} comments`}
              </div>
            </div>
          </div>
        </div>
      </Skeleton>
    )
  }

  const PostList = () => {
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
        wrapperContent={
          size(paginatedPosts) > 0 &&
          map(paginatedPosts, post => {
            return <PostListItem key={post.postId} post={post} user={user} isLoading={isLoading} />
          })
        }
      />
    )
  }

  return (
    <div className="container">
      <div className="row">
        <div className="col-12 col-md-5">
          <SocialProfileCard user={user} />
        </div>
        <div className="col-12 col-md-7">
          <SocialAddPostCard user={user} getPostsSvc={getPostsSvc} />
          <PostList />
        </div>
      </div>
    </div>
  )
}

export default SocialFeed

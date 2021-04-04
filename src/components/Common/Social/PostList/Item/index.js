import React, { useState } from 'react'
import { Avatar, Button, Skeleton, Typography } from 'antd'
import { CommentOutlined, LikeFilled, LikeOutlined } from '@ant-design/icons'
import { isNil, size } from 'lodash'
import moment from 'moment'
import { useHistory } from 'react-router-dom'
import { likePost, unlikePost } from 'services/social/posts'
import { LIKE, UNLIKE } from 'constants/text'
import { sendToSocialProfile } from 'components/utils'
import PostComments from '../../PostComment'

const SocialPostListItem = ({ user, post, isLoading }) => {
  const { Paragraph } = Typography
  const { LikePost } = post
  const history = useHistory()

  const [numComments, setNumComments] = useState(size(post.Comments))
  const [numLikePosts, setNumLikePosts] = useState(size(LikePost))
  const [showInteractionBox, setShowInteractionBox] = useState(false)

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
              <span
                role="button"
                tabIndex={0}
                className="invisible-btn font-weight-bold"
                onClick={() => sendToSocialProfile(history, user, post.User?.accountId)}
                onKeyDown={e => e.preventDefault()}
              >
                {`${!isNil(post.User?.firstName) ? post.User?.firstName : 'Anonymous'} ${
                  !isNil(post.User?.lastName) ? post.User?.lastName : 'Pigeon'
                }`}
              </span>
              <br />
              <small className="text-muted">{moment(post.createdAt).fromNow()}</small>
            </div>
          </div>
        </div>
        <div className="card-body pt-0 pb-0 description-body">
          <Paragraph
            ellipsis={{
              rows: 1,
              expandable: true,
              symbol: 'More',
            }}
          >
            {post.content}
          </Paragraph>
        </div>
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
              <Button
                block
                type="default"
                size="small"
                icon={<CommentOutlined />}
                onClick={() => setShowInteractionBox(!showInteractionBox)}
              >
                Comment
              </Button>
            </div>
            <div
              role="button"
              tabIndex={0}
              className="invisible-btn defocus-btn col-12 col-md text-left text-md-right mt-2 mb-3 mt-md-0 mb-md-0 order-1 order-md-12"
              onClick={() => setShowInteractionBox(!showInteractionBox)}
              onKeyDown={e => e.preventDefault()}
            >
              {numLikePosts === 1 ? `${numLikePosts} like` : `${numLikePosts} likes`}
              {' • '}
              {numComments === 1 ? `${numComments} comment` : `${numComments} comments`}
            </div>
          </div>
        </div>
        {showInteractionBox && (
          <PostComments user={user} post={post} setNumComments={setNumComments} />
        )}
      </div>
    </Skeleton>
  )
}

export default SocialPostListItem

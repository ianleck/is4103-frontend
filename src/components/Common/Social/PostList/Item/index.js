import React, { useEffect, useState } from 'react'
import { Avatar, Button, Dropdown, Menu, Skeleton, Typography } from 'antd'
import { CommentOutlined, LikeFilled, LikeOutlined, MoreOutlined } from '@ant-design/icons'
import { isEmpty, isNil, size } from 'lodash'
import moment from 'moment'
import { useHistory } from 'react-router-dom'
import { likePost, unlikePost } from 'services/social/posts'
import { LIKE, UNLIKE } from 'constants/text'
import { getUserFirstName, getUserFullName, sendToSocialProfile } from 'components/utils'
import { FRONTEND_API } from 'constants/constants'
import PostComments from '../../PostComment'
import ShareBtn from '../../ShareBtn'

const SocialPostListItem = ({ user, post, isLoading, showPostModalWithOptions, btnSize }) => {
  const { Paragraph } = Typography
  const LikePost = !isEmpty(post) ? post.LikePost : []
  const history = useHistory()

  const [numComments, setNumComments] = useState(size(post.Comments))
  const [numLikePosts, setNumLikePosts] = useState(size(LikePost))
  const [showInteractionBox, setShowInteractionBox] = useState(false)

  const [isLiked, setIsLiked] = useState(
    size(LikePost.filter(o => o.accountId === user.accountId)) > 0,
  )

  useEffect(() => {
    setNumComments(size(post.Comments))
    setNumLikePosts(size(LikePost))
    setIsLiked(size(LikePost.filter(o => o.accountId === user.accountId)) > 0)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [LikePost])

  const PostMenu = () => {
    return (
      <Menu>
        <Menu.Item>
          <a
            target="_blank"
            role="button"
            tabIndex={0}
            onClick={() => showPostModalWithOptions('edit', post)}
            onKeyDown={e => e.preventDefault()}
          >
            Edit Post
          </a>
        </Menu.Item>
        <Menu.Divider />
        <Menu.Item danger>
          <a
            target="_blank"
            role="button"
            tabIndex={0}
            onClick={() => showPostModalWithOptions('delete', post)}
            onKeyDown={e => e.preventDefault()}
          >
            Delete Post
          </a>
        </Menu.Item>
      </Menu>
    )
  }

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
                    ? post.User.profileImgUrl
                    : '/resources/images/avatars/avatar-2.png'
                }
              />
            </div>
            <div className="col">
              <span
                role="button"
                tabIndex={0}
                className="clickable font-weight-bold font-size-18"
                onClick={() => sendToSocialProfile(user, history, post.User?.accountId)}
                onKeyDown={e => e.preventDefault()}
              >
                {getUserFullName(post.User)}
              </span>
              <br />
              <span className="font-size-15 text-muted">{moment(post.createdAt).fromNow()}</span>
            </div>
            <div className="col-auto align-self-start">
              {user.accountId === post.accountId && (
                <Dropdown
                  overlay={<PostMenu />}
                  trigger={['click']}
                  overlayStyle={{ boxShadow: '2px 3px 5px 1px rgba(0, 0, 0, .1)' }}
                >
                  <Button
                    type="default"
                    size="large"
                    className="border-0 p-0"
                    icon={<MoreOutlined />}
                  />
                </Dropdown>
              )}
            </div>
          </div>
        </div>
        <div className="card-body pt-0 pb-0 description-body font-size-21">
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
          <div className="row align-items-center">
            <div
              role="button"
              tabIndex={0}
              className="clickable defocus-btn col-12 text-left"
              onClick={() => setShowInteractionBox(!showInteractionBox)}
              onKeyDown={e => e.preventDefault()}
            >
              {numLikePosts === 1 ? `${numLikePosts} like` : `${numLikePosts} likes`}
              {' • '}
              {numComments === 1 ? `${numComments} comment` : `${numComments} comments`}
            </div>
            <div className="col-auto mt-3 pr-1">
              <Button
                block
                type={isLiked ? 'primary' : 'default'}
                size={!isNil(btnSize) ? btnSize : 'medium'}
                icon={isLiked ? <LikeFilled /> : <LikeOutlined />}
                onClick={() => postAction(post.postId, isLiked ? 'unlike' : 'like')}
              >
                {isLiked ? UNLIKE : LIKE}
              </Button>
            </div>
            <div className="col-auto mt-3 pr-1">
              <Button
                block
                type="default"
                size={!isNil(btnSize) ? btnSize : 'medium'}
                icon={<CommentOutlined />}
                onClick={() => setShowInteractionBox(!showInteractionBox)}
              >
                Comment
              </Button>
            </div>
            <div className="col-auto mt-3 text-right text-sm-left">
              <ShareBtn
                quote={`${getUserFirstName(user)} is sharing this post with you!`}
                url={`${FRONTEND_API}/social/post/${post.postId}`}
                btnSize={!isNil(btnSize) ? btnSize : 'medium'}
              />
            </div>
          </div>
        </div>
        {showInteractionBox && (
          <PostComments
            user={user}
            post={post}
            setNumComments={setNumComments}
            showPostModalWithOptions={showPostModalWithOptions}
          />
        )}
      </div>
    </Skeleton>
  )
}

export default SocialPostListItem

import React from 'react'
import { Avatar, Button, Dropdown, Menu, Skeleton } from 'antd'
import { MoreOutlined } from '@ant-design/icons'
import moment from 'moment'
import { getUserFullName, sendToSocialProfile } from 'components/utils'
import { useHistory } from 'react-router-dom'
import { useSelector } from 'react-redux'

const PostCommentItem = ({ comment, isLoading, showCommentModalWithOptions }) => {
  const user = useSelector(state => state.user)
  const history = useHistory()

  const CommentMenu = () => {
    return (
      <Menu>
        {user.accountId === comment.accountId && (
          <Menu.Item>
            <a
              target="_blank"
              role="button"
              tabIndex={0}
              onClick={() => showCommentModalWithOptions('edit', comment)}
              onKeyDown={e => e.preventDefault()}
            >
              Edit Comment
            </a>
          </Menu.Item>
        )}
        {user.accountId === comment.accountId && <Menu.Divider />}
        {user.accountId === comment.accountId && (
          <Menu.Item>
            <a
              target="_blank"
              role="button"
              tabIndex={0}
              onClick={() => showCommentModalWithOptions('delete', comment)}
              onKeyDown={e => e.preventDefault()}
            >
              Delete Comment
            </a>
          </Menu.Item>
        )}
        {user.accountId === comment.accountId && <Menu.Divider />}
        <Menu.Item danger>
          <a
            target="_blank"
            role="button"
            tabIndex={0}
            onClick={() => showCommentModalWithOptions('report', comment)}
            onKeyDown={e => e.preventDefault()}
          >
            Report Comment
          </a>
        </Menu.Item>
      </Menu>
    )
  }

  return (
    <div className="row align-items-center mb-3">
      <div className="col-auto">
        <Avatar
          src={
            comment.User?.profileImgUrl
              ? comment.User.profileImgUrl
              : '/resources/images/avatars/avatar-2.png'
          }
        />
      </div>
      <div className="col">
        <div className="row text-dark">
          <div className="col-12">
            <span
              role="button"
              tabIndex={0}
              className="clickable font-weight-bold"
              onClick={() => sendToSocialProfile(history, comment.User?.accountId)}
              onKeyDown={e => e.preventDefault()}
            >
              {getUserFullName(comment.User)}
            </span>
            <small className="text-muted">&nbsp;&nbsp;{moment(comment.createdAt).fromNow()}</small>
          </div>
          <div className="col-12">
            <Skeleton active loading={isLoading} paragraph={false}>
              <span>{comment.body}</span>
            </Skeleton>
          </div>
        </div>
      </div>
      <div className="col-auto align-self-start">
        <Dropdown
          overlay={<CommentMenu />}
          trigger={['click']}
          overlayStyle={{ boxShadow: '2px 3px 5px 1px rgba(0, 0, 0, .1)' }}
        >
          <Button type="text" icon={<MoreOutlined />} />
        </Dropdown>
      </div>
    </div>
  )
}
export default PostCommentItem

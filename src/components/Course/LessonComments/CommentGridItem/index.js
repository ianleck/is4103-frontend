import React from 'react'
import { Avatar, Button, Dropdown, Menu, Skeleton } from 'antd'
import { isNil } from 'lodash'
import moment from 'moment'
import { MoreOutlined } from '@ant-design/icons'

const CommentGridItem = ({ comment, user, isLoading, deleteCommentFromVideo }) => {
  const commentMenu = (commentId, commenterAccId) => {
    return (
      <Menu>
        {user.accountId === commenterAccId && (
          <Menu.Item>
            <a
              target="_blank"
              role="button"
              tabIndex={0}
              onClick={() => deleteCommentFromVideo(commentId)}
              onKeyDown={e => e.preventDefault()}
            >
              Delete Comment
            </a>
          </Menu.Item>
        )}
        {user.accountId === commenterAccId && <Menu.Divider />}
        <Menu.Item danger>Report Comment</Menu.Item>
      </Menu>
    )
  }

  return (
    <div className="row align-items-center mb-4">
      <div className="col-auto">
        <Avatar
          src={
            comment.User?.profileImgUrl
              ? `${user.profileImgUrl}?${new Date().getTime()}`
              : '/resources/images/avatars/avatar-2.png'
          }
        />
      </div>
      <div className="col">
        <div className="row text-dark">
          <div className="col-12">
            <span className="h5 font-weight-bold">
              {`${!isNil(comment.User?.firstName) ? comment.User?.firstName : 'Anonymous'} ${
                !isNil(comment.User?.lastName) ? comment.User?.lastName : 'Pigeon'
              }`}
            </span>
            <span className="text-muted">&nbsp;&nbsp;{moment(comment.createdAt).fromNow()}</span>
          </div>
          <div className="col-12">
            <Skeleton active loading={isLoading} paragraph={false}>
              <span>{comment.body}</span>
            </Skeleton>
          </div>
        </div>
      </div>
      <div className="col-auto align-self-start">
        <Dropdown overlay={commentMenu(comment.commentId, comment.accountId)}>
          <Button type="text" size="large" icon={<MoreOutlined />} />
        </Dropdown>
      </div>
    </div>
  )
}

export default CommentGridItem

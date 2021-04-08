import React from 'react'
import { Avatar, Button, Dropdown, Menu, Skeleton } from 'antd'
import { isNil } from 'lodash'
import moment from 'moment'
import { MoreOutlined } from '@ant-design/icons'

const CommentGridItem = ({ comment, user, isLoading, handleDelete, handleReport, isAdmin }) => {
  const commentMenu = () => {
    return (
      <Menu>
        {user.accountId === comment.accountId && (
          <Menu.Item>
            <a
              target="_blank"
              role="button"
              tabIndex={0}
              onClick={() => handleDelete(comment)}
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
            onClick={() => handleReport(comment)}
            onKeyDown={e => e.preventDefault()}
          >
            Report Comment
          </a>
        </Menu.Item>
      </Menu>
    )
  }

  return (
    <div className="row align-items-center mb-4">
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
      {!isAdmin && (
        <div className="col-auto align-self-start">
          <Dropdown
            overlay={commentMenu()}
            trigger={['click']}
            overlayStyle={{ boxShadow: '2px 3px 5px 1px rgba(0, 0, 0, .1)' }}
          >
            <Button type="text" size="large" icon={<MoreOutlined />} />
          </Dropdown>
        </div>
      )}
    </div>
  )
}

export default CommentGridItem

import React from 'react'
import { Avatar, Button, Dropdown, Menu, Skeleton } from 'antd'
import { MoreOutlined } from '@ant-design/icons'
import { isNil } from 'lodash'
import moment from 'moment'
import { sendToSocialProfile } from 'components/utils'
import { useHistory } from 'react-router-dom'
import { useSelector } from 'react-redux'

const PostCommentItem = ({ comment, isLoading }) => {
  const user = useSelector(state => state.user)
  const history = useHistory()

  const CommentMenu = () => {
    return (
      <Menu>
        {
          <Menu.Item>
            <a target="_blank" role="button" tabIndex={0} onKeyDown={e => e.preventDefault()}>
              Delete Comment
            </a>
          </Menu.Item>
        }
        {<Menu.Divider />}
        <Menu.Item danger>
          <a target="_blank" role="button" tabIndex={0} onKeyDown={e => e.preventDefault()}>
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
              ? `${comment.User.profileImgUrl}?${new Date().getTime()}`
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
              className="invisible-btn font-weight-bold"
              onClick={() => sendToSocialProfile(history, user, comment.User?.accountId)}
              onKeyDown={e => e.preventDefault()}
            >
              {`${!isNil(comment.User?.firstName) ? comment.User?.firstName : 'Anonymous'} ${
                !isNil(comment.User?.lastName) ? comment.User?.lastName : 'Pigeon'
              }`}
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
        <Dropdown overlay={<CommentMenu />}>
          <Button type="text" icon={<MoreOutlined />} />
        </Dropdown>
      </div>
    </div>
  )
}
export default PostCommentItem

import React, { useState } from 'react'
import { useSelector } from 'react-redux'
import { Avatar, Button, Divider, Dropdown, Form, Input, Menu, Space } from 'antd'
import { ADD_COMMENTS } from 'constants/text'
import { MoreOutlined } from '@ant-design/icons'
import { isNil, map, size } from 'lodash'
import { showNotification } from 'components/utils'
import {
  ERROR,
  SUCCESS,
  COMMENT_DEL_SUCCESS,
  COMMENT_DEL_ERR,
  COMMENT_ADD_SUCCESS,
  COMMENT_ADD_ERR,
} from 'constants/notifications'
import { getCommentsByLessonId, deleteComment, addCommentToLesson } from 'services/courses/lessons'
import moment from 'moment'

const LessonComments = ({ comments, setComments, lessonId, currentLesson }) => {
  const user = useSelector(state => state.user)
  const [showCommentField, setShowCommentField] = useState(false)

  const { TextArea } = Input
  const [addCommentForm] = Form.useForm()

  const onFinishFailed = errorInfo => {
    console.log('Failed:', errorInfo)
  }

  const sortComments = comments.sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
  )

  const getLessonComments = async () => {
    const result = await getCommentsByLessonId(lessonId)
    if (result && !isNil(result.comments)) {
      setComments(result.comments)
    }
  }

  const addCommentToVideo = async values => {
    const formValues = {
      body: values.body.trim(),
    }
    const result = await addCommentToLesson(currentLesson.lessonId, formValues)
    if (result && !isNil(result.message)) {
      if (result.comment) {
        getLessonComments()
        showNotification('success', SUCCESS, COMMENT_ADD_SUCCESS)
        setShowCommentField(false)
      }
    } else {
      showNotification('error', ERROR, COMMENT_ADD_ERR)
    }
  }

  const deleteCommentFromVideo = async commentIdToDelete => {
    const result = await deleteComment(commentIdToDelete)
    if (result && !isNil(result.message)) {
      getLessonComments()
      showNotification('success', SUCCESS, COMMENT_DEL_SUCCESS)
    } else {
      showNotification('error', ERROR, COMMENT_DEL_ERR)
    }
  }

  const ToggleCommentField = () => {
    return (
      <div
        role="button"
        className="col btn border-0 text-left"
        tabIndex={0}
        onClick={() => setShowCommentField(true)}
        onKeyDown={event => event.preventDefault()}
      >
        <span className="text-secondary">{ADD_COMMENTS}</span>
        <Divider className="m-0" />
      </div>
    )
  }

  const AddCommentField = () => {
    return (
      <div>
        <Form
          form={addCommentForm}
          id="addCommentForm"
          layout="vertical"
          hideRequiredMark
          onSubmit={e => e.preventDefault()}
          onFinish={addCommentToVideo}
          onFinishFailed={onFinishFailed}
        >
          <Form.Item
            className="mb-0"
            name="body"
            rules={[{ required: true, message: 'Your comment cannot be empty.' }]}
          >
            <div className="row">
              <div className="col">
                <TextArea
                  autoSize={{ minRows: 2, maxRows: 6 }}
                  size="large"
                  placeholder={ADD_COMMENTS}
                />
              </div>
            </div>
          </Form.Item>
          <div className="row mt-2">
            <div className="col-12 text-right">
              <Space>
                <Button ghost type="primary" onClick={() => setShowCommentField(false)}>
                  Cancel
                </Button>
                <Button type="primary" form="addCommentForm" htmlType="submit">
                  Comment
                </Button>
              </Space>
            </div>
          </div>
        </Form>
      </div>
    )
  }

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

  const CommentGridItem = data => {
    const { comment } = data
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
              <span>{comment.body}</span>
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

  return (
    <div className="row mb-5">
      <div className="col-auto">
        <Avatar
          src={
            user.profileImgUrl
              ? `${user.profileImgUrl}?${new Date().getTime()}`
              : '/resources/images/avatars/apprentice.png'
          }
        />
      </div>
      <div className="col pl-0">
        {!showCommentField && <ToggleCommentField />}
        {showCommentField && <AddCommentField />}
      </div>
      <div className="col-12 mt-5 mt-lg-4">
        {size(sortComments) > 0 &&
          map(sortComments, comment => {
            return <CommentGridItem key={comment.commentId} comment={comment} />
          })}
      </div>
    </div>
  )
}

export default LessonComments

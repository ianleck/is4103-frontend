import React, { useState, useEffect } from 'react'
import { useSelector } from 'react-redux'
import {
  Avatar,
  Button,
  Divider,
  Dropdown,
  Form,
  Input,
  Menu,
  Space,
  Modal,
  Select,
  Descriptions,
} from 'antd'
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
  COMPLAINT_SENT,
} from 'constants/notifications'
import { getCommentsByLessonId, deleteComment, addCommentToLesson } from 'services/courses/lessons'
import moment from 'moment'
import { getComplaintReasons, postCommentComplaint } from 'services/complaints'

const { Option } = Select

const LessonComments = ({ comments, setComments, lessonId, currentLesson }) => {
  const user = useSelector(state => state.user)
  const [showCommentField, setShowCommentField] = useState(false)
  const [showConfirmDelete, setShowConfirmDelete] = useState(false)
  const [commentToDelete, setCommentToDelete] = useState()
  const [showReporting, setShowReporting] = useState(false)
  const [commentToReport, setCommentToReport] = useState()
  const [reasons, setReasons] = useState([])

  const { TextArea } = Input
  const [addCommentForm] = Form.useForm()

  useEffect(() => {
    const getReasons = async () => {
      const response = await getComplaintReasons()
      setReasons(response)
    }
    getReasons()
  }, [])

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

  const deleteCommmentFooter = (
    <div className="row justify-content-between">
      <div className="col-auto">
        <Button type="default" size="large" onClick={() => reset()}>
          Close
        </Button>
      </div>
      <div className="col-auto">
        <Button danger size="large" onClick={() => deleteConfirmed()}>
          Delete Comment
        </Button>
      </div>
    </div>
  )

  const reportCommmentFooter = (
    <div className="row justify-content-between">
      <div className="col-auto">
        <Button type="default" size="large" onClick={() => reset()}>
          Close
        </Button>
      </div>
      <div className="col-auto">
        <Button danger form="reportCommentForm" htmlType="submit" size="large">
          Report Comment
        </Button>
      </div>
    </div>
  )

  const reset = () => {
    setShowReporting(false)
    setCommentToReport()
    setShowConfirmDelete(false)
    setCommentToDelete()
  }

  const handleDelete = comment => {
    setCommentToDelete(comment)
    setShowConfirmDelete(true)
  }

  const deleteConfirmed = () => {
    deleteCommentFromVideo(commentToDelete.commentId)
    setCommentToDelete()
    setShowConfirmDelete(false)
  }

  const handleReport = comment => {
    setCommentToReport(comment)
    setShowReporting(true)
  }

  const onReportComment = async values => {
    const payload = { complaintReasonId: values.reason }

    const response = await postCommentComplaint(commentToReport.commentId, payload)

    if (response.success) {
      showNotification('success', SUCCESS, COMPLAINT_SENT)
    }
    setCommentToReport()
    setShowReporting(false)
  }

  const commentMenu = comment => {
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
          <Dropdown overlay={commentMenu(comment)}>
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

      <div>
        <Modal
          title="Comment Deletion"
          visible={showConfirmDelete}
          centered
          okButtonProps={{ style: { display: 'none' } }}
          onCancel={() => setShowConfirmDelete(false)}
          footer={deleteCommmentFooter}
        >
          Are you sure you want to delete the comment?
        </Modal>
      </div>

      <div>
        <Modal
          title="Report Comment"
          visible={showReporting}
          centered
          okButtonProps={{ style: { display: 'none' } }}
          onCancel={() => setShowReporting(false)}
          footer={reportCommmentFooter}
        >
          <Descriptions title="Comment Information" column={1}>
            <Descriptions.Item label="ID">
              {commentToReport ? commentToReport.commentId : null}
            </Descriptions.Item>
            <Descriptions.Item label="Author">
              {commentToReport
                ? `${commentToReport.User.firstName} ${commentToReport.User.lastName}`
                : null}
            </Descriptions.Item>
            <Descriptions.Item label="Body">
              {commentToReport ? commentToReport.body : null}
            </Descriptions.Item>
          </Descriptions>

          <Form
            id="reportCommentForm"
            layout="vertical"
            hideRequiredMark
            onFinish={onReportComment}
            onFinishFailed={onFinishFailed}
          >
            <div className="row">
              <div className="col-12">
                <Form.Item
                  name="reason"
                  label="reason"
                  rules={[{ required: true, message: 'Please input reason' }]}
                >
                  <Select placeholder="Select Complaint Reason">
                    {map(reasons, reason => {
                      return (
                        <Option value={reason.complaintReasonId} key={reason.complaintReasonId}>
                          {reason.reason}
                        </Option>
                      )
                    })}
                  </Select>
                </Form.Item>
              </div>
            </div>
          </Form>
        </Modal>
      </div>
    </div>
  )
}

export default LessonComments

import React, { useState, useEffect } from 'react'
import { useSelector } from 'react-redux'
import { Avatar, Button, Divider, Form, Input, Space, Modal, Select, Descriptions } from 'antd'
import { ADD_COMMENTS } from 'constants/text'
import { isNil, map, size } from 'lodash'
import { initPageItems, showNotification, sortDescAndKeyCommentId } from 'components/utils'
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
import { getComplaintReasons, postCommentComplaint } from 'services/complaints'
import PaginationWrapper from 'components/Common/Pagination'
import CommentGridItem from './CommentGridItem'

const LessonComments = ({ lessonId, currentLesson, isAdmin }) => {
  const { Option } = Select
  const user = useSelector(state => state.user)

  const [comments, setComments] = useState([])
  const [showCommentField, setShowCommentField] = useState(false)
  const [showConfirmDelete, setShowConfirmDelete] = useState(false)
  const [commentToDelete, setCommentToDelete] = useState()
  const [showReporting, setShowReporting] = useState(false)
  const [commentToReport, setCommentToReport] = useState()
  const [reasons, setReasons] = useState([])

  const [paginatedComments, setPaginatedComments] = useState([])
  const [currentPageIdx, setCurrentPageIdx] = useState(1)
  const [showLoadMore, setShowLoadMore] = useState(true)
  const [isLoading, setIsLoading] = useState(false)

  const { TextArea } = Input
  const [addCommentForm] = Form.useForm()

  const onFinishFailed = errorInfo => {
    console.log('Failed:', errorInfo)
  }

  const getReasons = async () => {
    const response = await getComplaintReasons()
    setReasons(response)
  }

  const getLessonComments = async () => {
    setIsLoading(true)
    const result = await getCommentsByLessonId(lessonId)
    if (result && !isNil(result.comments)) {
      setComments(sortDescAndKeyCommentId(result.comments))
    }
    initPageItems(setIsLoading, comments, setPaginatedComments, setCurrentPageIdx, setShowLoadMore)
  }

  useEffect(() => {
    getLessonComments()
    getReasons()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

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
                  ref={input => input && input.focus()}
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

  return (
    <div className="row mb-5">
      {!isAdmin && (
        <div className="col-auto">
          <Avatar
            src={user.profileImgUrl ? user.profileImgUrl : '/resources/images/avatars/avatar-2.png'}
          />
        </div>
      )}
      {!isAdmin && (
        <div className="col pl-0">
          {!showCommentField && <ToggleCommentField />}
          {showCommentField && <AddCommentField />}
        </div>
      )}
      <div className="col-12 mt-5 mt-lg-4">
        <PaginationWrapper
          setIsLoading={setIsLoading}
          totalData={comments}
          paginatedData={paginatedComments}
          setPaginatedData={setPaginatedComments}
          currentPageIdx={currentPageIdx}
          setCurrentPageIdx={setCurrentPageIdx}
          showLoadMore={showLoadMore}
          setShowLoadMore={setShowLoadMore}
          buttonStyle="primary"
          wrapperContent={
            size(paginatedComments) > 0 &&
            map(paginatedComments, comment => {
              return (
                <CommentGridItem
                  key={comment.commentId}
                  comment={comment}
                  user={user}
                  isLoading={isLoading}
                  handleDelete={handleDelete}
                  handleReport={handleReport}
                  isAdmin={isAdmin}
                />
              )
            })
          }
        />
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
          Are you sure you want to delete this comment?
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
                  label="Reason"
                  rules={[{ required: true, message: 'Please select a reason for the complaint.' }]}
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

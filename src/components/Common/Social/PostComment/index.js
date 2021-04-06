import React, { useEffect, useState } from 'react'
import { Avatar, Button, Descriptions, Divider, Form, Input, Modal, Select, Space } from 'antd'
import { isNil, map, size } from 'lodash'
import {
  initPageItems,
  onFinishFailed,
  showNotification,
  sortArrByCreatedAt,
  sortDescAndKeyCommentId,
} from 'components/utils'
import {
  COMMENT_ADD_ERR,
  COMMENT_ADD_SUCCESS,
  COMMENT_DEL_SUCCESS,
  COMMENT_EDIT_ERR,
  COMMENT_EDIT_SUCCESS,
  COMPLAINT_SENT,
  ERROR,
  SUCCESS,
} from 'constants/notifications'
import PaginationWrapper from 'components/Common/Pagination'
import { ADD_COMMENTS } from 'constants/text'
import { DIRECTION } from 'constants/constants'
import { addCommentToPost, editCommentOnPost, deleteCommentOnPost } from 'services/social/posts'
import { getComplaintReasons, postCommentComplaint } from 'services/complaints'
import PostCommentItem from './Item'

const PostComments = ({ user, post, setNumComments }) => {
  const { TextArea } = Input
  const { Option } = Select

  const sortedComments = sortArrByCreatedAt(post.Comments, DIRECTION.DESC)

  const [addCommentForm] = Form.useForm()
  const [editCommentForm] = Form.useForm()
  const [showCommentField, setShowCommentField] = useState(false)
  const [comments, setComments] = useState(sortedComments)

  const [isLoading, setIsLoading] = useState(false)
  const [paginatedComments, setPaginatedComments] = useState([])
  const [currentPageIdx, setCurrentPageIdx] = useState(1)
  const [showLoadMore, setShowLoadMore] = useState(false)

  const [showCommentModal, setShowCommentModal] = useState(false)
  const [commentModalOptions, setCommentModalOptions] = useState('')
  const [currentComment, setCurrentComment] = useState('')
  const [reasons, setReasons] = useState([])

  useEffect(() => {
    initPageItems(
      setIsLoading,
      sortedComments,
      setPaginatedComments,
      setCurrentPageIdx,
      setShowLoadMore,
    )
    getReasons()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const getReasons = async () => {
    const response = await getComplaintReasons()
    setReasons(response)
  }

  const addCommentToPostSvc = async values => {
    const formValues = {
      body: values.body.trim(),
    }
    if (!isNil(user.accountId)) {
      const response = await addCommentToPost(post.postId, formValues)
      if (response && !isNil(response.comment)) {
        showNotification('success', SUCCESS, COMMENT_ADD_SUCCESS)
        setShowCommentField(false)
        addCommentForm.resetFields()
        response.comment.User = {
          accountId: user.accountId,
          firstName: user.firstName,
          lastName: user.lastName,
          profileImgUrl: user.profileImgUrl,
        }
        comments.push(response.comment)
        const allComments = sortDescAndKeyCommentId(comments)
        setComments(allComments)
        initPageItems(
          setIsLoading,
          allComments,
          setPaginatedComments,
          setCurrentPageIdx,
          setShowLoadMore,
        )
        setNumComments(size(allComments))
      } else {
        showNotification('error', ERROR, COMMENT_ADD_ERR)
      }
    }
  }

  const editCommentSvc = async values => {
    const formValues = {
      body: values.body.trim(),
    }
    if (!isNil(currentComment.commentId)) {
      const response = await editCommentOnPost(currentComment.commentId, formValues)
      if (response && !isNil(response.comment)) {
        showNotification('success', SUCCESS, COMMENT_EDIT_SUCCESS)
        setShowCommentModal(false)
        comments.find(comment => comment.commentId === currentComment.commentId).body =
          response.comment.body
        const allComments = sortDescAndKeyCommentId(comments)
        setComments(allComments)
        initPageItems(
          setIsLoading,
          allComments,
          setPaginatedComments,
          setCurrentPageIdx,
          setShowLoadMore,
        )
      } else {
        showNotification('error', ERROR, COMMENT_EDIT_ERR)
      }
    }
  }

  const deleteCommentSvc = async () => {
    if (!isNil(currentComment.commentId)) {
      const response = await deleteCommentOnPost(currentComment.commentId)
      if (response && response.success) {
        showNotification('success', SUCCESS, COMMENT_DEL_SUCCESS)
        setShowCommentModal(false)
        comments.splice(
          comments.findIndex(comment => {
            return comment.commentId === currentComment.commentId
          }),
          1,
        )
        const allComments = sortDescAndKeyCommentId(comments)
        setComments(allComments)
        initPageItems(
          setIsLoading,
          allComments,
          setPaginatedComments,
          setCurrentPageIdx,
          setShowLoadMore,
        )
      }
    }
  }

  const reportCommentSvc = async values => {
    const payload = { complaintReasonId: values.reason }

    if (!isNil(currentComment.commentId)) {
      const response = await postCommentComplaint(currentComment.commentId, payload)
      if (response && response.success) {
        showNotification('success', SUCCESS, COMPLAINT_SENT)
        setShowCommentModal(false)
      }
    }
  }

  const showCommentModalWithOptions = (type, comment) => {
    setCommentModalOptions(type)
    if (!isNil(comment)) setCurrentComment(comment)
    switch (type) {
      case 'edit':
        editCommentForm.setFieldsValue({
          body: comment.body,
        })
        break
      case 'delete':
        break
      case 'report':
        break
      default:
        break
    }
    setShowCommentModal(true)
  }

  const postModalAction = type => {
    if (type === 'delete') deleteCommentSvc()
  }

  const CommentModalBody = () => {
    if (commentModalOptions === 'delete') {
      return <span>Are you sure you want to delete this comment?</span>
    }
    if (commentModalOptions === 'edit') {
      return (
        <div className="row">
          <div className="col-12">
            <Form
              form={editCommentForm}
              id="editCommentForm"
              layout="vertical"
              hideRequiredMark
              onSubmit={e => e.preventDefault()}
              onFinish={editCommentSvc}
              onFinishFailed={onFinishFailed}
              initialValues={{
                body: currentComment.body,
              }}
            >
              <Form.Item
                className="mb-0"
                name="body"
                rules={[{ required: true, message: 'Your comment cannot be empty.' }]}
              >
                <TextArea
                  autoSize={{ minRows: 1, maxRows: 6 }}
                  size="large"
                  ref={input => input && input.focus()}
                />
              </Form.Item>
            </Form>
          </div>
        </div>
      )
    }
    if (commentModalOptions === 'report') {
      return (
        <div>
          <Descriptions title="Comment Information" column={1}>
            <Descriptions.Item label="ID">
              {currentComment ? currentComment.commentId : null}
            </Descriptions.Item>
            <Descriptions.Item label="Author">
              {currentComment
                ? `${currentComment.User.firstName} ${currentComment.User.lastName}`
                : null}
            </Descriptions.Item>
            <Descriptions.Item label="Body">
              {currentComment ? currentComment.body : null}
            </Descriptions.Item>
          </Descriptions>

          <Form
            id="reportCommentForm"
            layout="vertical"
            hideRequiredMark
            onFinish={reportCommentSvc}
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
        </div>
      )
    }
    return <></>
  }

  const CommentModalFooter = () => {
    return (
      <div className="row justify-content-between">
        <div className="col-auto">
          <Button type="default" size="large" onClick={() => setShowCommentModal(false)}>
            Close
          </Button>
        </div>
        <div className="col-auto">
          {commentModalOptions === 'edit' && (
            <Button type="primary" size="large" form="editCommentForm" htmlType="submit">
              {getCommentModalTitle()}
            </Button>
          )}
          {commentModalOptions === 'delete' && (
            <Button danger size="large" onClick={() => postModalAction(commentModalOptions)}>
              {getCommentModalTitle()}
            </Button>
          )}
          {commentModalOptions === 'report' && (
            <Button danger type="primary" size="large" form="reportCommentForm" htmlType="submit">
              {getCommentModalTitle()}
            </Button>
          )}
        </div>
      </div>
    )
  }

  const getCommentModalTitle = () => {
    if (commentModalOptions === 'edit') return 'Edit Comment'
    if (commentModalOptions === 'delete') return 'Delete Comment'
    if (commentModalOptions === 'report') return 'Report Comment'
    return 'Error'
  }

  const ToggleCommentField = () => {
    return (
      <div
        role="button"
        className="col btn btn-light border-0 text-left"
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
      <Form
        form={addCommentForm}
        id="addCommentForm"
        layout="vertical"
        hideRequiredMark
        onSubmit={e => e.preventDefault()}
        onFinish={addCommentToPostSvc}
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
                autoSize={{ minRows: 1, maxRows: 3 }}
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
    )
  }

  return (
    <div className="row">
      <div className="col-12">
        <div className="card mt-0 mb-0 border-0 bg-light">
          <div className="card-body">
            <div className="row mb-3">
              <div className="col-auto">
                <Avatar
                  src={
                    user.profileImgUrl
                      ? `${user.profileImgUrl}?${new Date().getTime()}`
                      : '/resources/images/avatars/avatar-2.png'
                  }
                />
              </div>
              <div className="col pl-0">
                {!showCommentField && <ToggleCommentField />}
                {showCommentField && <AddCommentField />}
              </div>
            </div>
            <PaginationWrapper
              setIsLoading={setIsLoading}
              totalData={comments}
              paginatedData={paginatedComments}
              setPaginatedData={setPaginatedComments}
              currentPageIdx={currentPageIdx}
              setCurrentPageIdx={setCurrentPageIdx}
              showLoadMore={showLoadMore}
              setShowLoadMore={setShowLoadMore}
              buttonStyle="link"
              wrapperContent={
                size(paginatedComments) > 0 &&
                map(paginatedComments, comment => {
                  return (
                    <PostCommentItem
                      key={comment.commentId}
                      comment={comment}
                      isLoading={isLoading}
                      showCommentModalWithOptions={showCommentModalWithOptions}
                    />
                  )
                })
              }
            />
          </div>
        </div>
      </div>
      <Modal
        title={getCommentModalTitle()}
        visible={showCommentModal}
        centered
        destroyOnClose
        okButtonProps={{ style: { display: 'none' } }}
        onCancel={() => setShowCommentModal(false)}
        footer={<CommentModalFooter />}
      >
        <CommentModalBody />
      </Modal>
    </div>
  )
}

export default PostComments

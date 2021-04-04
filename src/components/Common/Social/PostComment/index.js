import React, { useEffect, useState } from 'react'
import { Avatar, Button, Divider, Form, Input, Space } from 'antd'
import { isNil, map, size } from 'lodash'
import { addCommentToPost } from 'services/social/posts'
import {
  initPageItems,
  onFinishFailed,
  showNotification,
  sortArrByCreatedAt,
} from 'components/utils'
import { COMMENT_ADD_ERR, COMMENT_ADD_SUCCESS, ERROR, SUCCESS } from 'constants/notifications'
import { ADD_COMMENTS } from 'constants/text'
import PaginationWrapper from 'components/Common/Pagination'
import { DIRECTION } from 'constants/constants'
import PostCommentItem from './Item'

const PostComments = ({ user, post, setNumComments }) => {
  const { TextArea } = Input

  const sortedComments = sortArrByCreatedAt(post.Comments, DIRECTION.DESC)

  const [addCommentForm] = Form.useForm()
  const [showCommentField, setShowCommentField] = useState(false)
  const [comments, setComments] = useState(sortedComments)

  const [isLoading, setIsLoading] = useState(false)
  const [paginatedComments, setPaginatedComments] = useState([])
  const [currentPageIdx, setCurrentPageIdx] = useState(1)
  const [showLoadMore, setShowLoadMore] = useState(false)

  useEffect(() => {
    initPageItems(
      setIsLoading,
      sortedComments,
      setPaginatedComments,
      setCurrentPageIdx,
      setShowLoadMore,
    )
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

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
        sortedComments.push(response.comment)
        setComments(sortedComments)
        initPageItems(
          setIsLoading,
          sortedComments,
          setPaginatedComments,
          setCurrentPageIdx,
          setShowLoadMore,
        )
        setNumComments(size(sortedComments))
      } else {
        showNotification('error', ERROR, COMMENT_ADD_ERR)
      }
    }
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
                      user={user}
                      isLoading={isLoading}
                    />
                  )
                })
              }
            />
          </div>
        </div>
      </div>
    </div>
  )
}

export default PostComments

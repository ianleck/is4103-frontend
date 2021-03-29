import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { Avatar, Button, Divider, Form, Input, Space } from 'antd'
import { ADD_COMMENTS } from 'constants/text'
import { isNil, map, size } from 'lodash'
import { showNotification, sortDescAndKeyCommentId } from 'components/utils'
import {
  ERROR,
  SUCCESS,
  COMMENT_DEL_SUCCESS,
  COMMENT_DEL_ERR,
  COMMENT_ADD_SUCCESS,
  COMMENT_ADD_ERR,
} from 'constants/notifications'
import { getCommentsByLessonId, deleteComment, addCommentToLesson } from 'services/courses/lessons'
import { DEFAULT_ITEMS_PER_PAGE, DEFAULT_TIMEOUT } from 'constants/constants'
import PaginationWrapper from 'components/Common/Pagination'
import CommentGridItem from './CommentGridItem'

const LessonComments = ({ lessonId, currentLesson, isAdmin }) => {
  const user = useSelector(state => state.user)

  const [comments, setComments] = useState([])
  const [showCommentField, setShowCommentField] = useState(false)

  const [paginatedComments, setPaginatedComments] = useState([])
  const [currentPageIdx, setCurrentPageIdx] = useState(1)
  const [showLoadMore, setShowLoadMore] = useState(true)
  const [isLoading, setIsLoading] = useState(false)

  const { TextArea } = Input
  const [addCommentForm] = Form.useForm()

  const onFinishFailed = errorInfo => {
    console.log('Failed:', errorInfo)
  }

  const getLessonComments = async () => {
    setIsLoading(true)
    const result = await getCommentsByLessonId(lessonId)
    if (result && !isNil(result.comments)) {
      setComments(sortDescAndKeyCommentId(result.comments))
    }
    const tempPaginatedItems = []
    for (let i = 0; i < DEFAULT_ITEMS_PER_PAGE; i += 1) {
      tempPaginatedItems.push(result.comments[i])
    }
    setPaginatedComments(tempPaginatedItems)
    setCurrentPageIdx(1)
    setShowLoadMore(true)
    setTimeout(() => {
      setIsLoading(false)
    }, DEFAULT_TIMEOUT)
  }

  useEffect(() => {
    getLessonComments()
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

  return (
    <div className="row mb-5">
      {!isAdmin && (
        <div className="col-auto">
          <Avatar
            src={
              user.profileImgUrl
                ? `${user.profileImgUrl}?${new Date().getTime()}`
                : '/resources/images/avatars/apprentice.png'
            }
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
          wrapperContent={
            size(paginatedComments) > 0 &&
            map(paginatedComments, comment => {
              return (
                <CommentGridItem
                  key={comment.commentId}
                  comment={comment}
                  user={user}
                  isLoading={isLoading}
                  deleteCommentFromVideo={deleteCommentFromVideo}
                />
              )
            })
          }
        />
      </div>
    </div>
  )
}

export default LessonComments

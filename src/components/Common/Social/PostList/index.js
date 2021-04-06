import React, { useState } from 'react'
import { isNil, map, size } from 'lodash'
import { Button, Empty, Form, Input, Modal } from 'antd'
import PaginationWrapper from 'components/Common/Pagination'
import {
  initPageItems,
  onFinishFailed,
  showNotification,
  sortDescAndKeyPostId,
} from 'components/utils'
import { deletePost, editPost } from 'services/social/posts'
import {
  ERROR,
  POST_DEL_SUCCESS,
  POST_EDIT_ERR,
  POST_EDIT_SUCCESS,
  SUCCESS,
} from 'constants/notifications'
import SocialPostListItem from './Item'

const SocialPostList = ({
  user,
  isLoading,
  setIsLoading,
  posts,
  setPosts,
  paginatedPosts,
  setPaginatedPosts,
  currentPageIdx,
  setCurrentPageIdx,
  showLoadMore,
  setShowLoadMore,
  btnSize,
}) => {
  const { TextArea } = Input

  const [editPostForm] = Form.useForm()

  const [showPostModal, setShowPostModal] = useState(false)
  const [postModalOptions, setPostModalOptions] = useState('')
  const [currentPost, setCurrentPost] = useState('')

  const editPostSvc = async values => {
    const formValues = {
      content: values.content.trim(),
    }
    if (!isNil(currentPost.postId)) {
      const response = await editPost(currentPost.postId, formValues)
      if (response && !isNil(response.post)) {
        showNotification('success', SUCCESS, POST_EDIT_SUCCESS)
        setShowPostModal(false)
        posts.find(post => post.postId === currentPost.postId).content = response.post.content
        const allPosts = sortDescAndKeyPostId(posts)
        setPosts(allPosts)
        initPageItems(setIsLoading, allPosts, setPaginatedPosts, setCurrentPageIdx, setShowLoadMore)
      } else {
        showNotification('error', ERROR, POST_EDIT_ERR)
      }
    }
  }

  const deletePostSvc = async () => {
    if (!isNil(currentPost.postId)) {
      const response = await deletePost(currentPost.postId)
      if (response && response.success) {
        showNotification('success', SUCCESS, POST_DEL_SUCCESS)
        setShowPostModal(false)
        posts.splice(
          posts.findIndex(post => {
            return post.postId === currentPost.postId
          }),
          1,
        )
        const allPosts = sortDescAndKeyPostId(posts)
        setPosts(allPosts)
        initPageItems(setIsLoading, allPosts, setPaginatedPosts, setCurrentPageIdx, setShowLoadMore)
      }
    }
  }

  const showPostModalWithOptions = (type, post) => {
    setPostModalOptions(type)
    setCurrentPost(post)
    switch (type) {
      case 'edit':
        editPostForm.setFieldsValue({
          content: post.content,
        })
        break
      case 'delete':
        break
      default:
        break
    }
    setShowPostModal(true)
  }

  const postModalAction = type => {
    if (type === 'delete') deletePostSvc()
  }

  const getPostModalBody = type => {
    if (type === 'delete') {
      return <span>Are you sure you want to delete this post?</span>
    }
    if (type === 'edit') {
      return (
        <div className="row">
          <div className="col-12">
            <Form
              form={editPostForm}
              id="editPostForm"
              layout="vertical"
              hideRequiredMark
              onSubmit={e => e.preventDefault()}
              onFinish={editPostSvc}
              onFinishFailed={onFinishFailed}
              initialValues={{
                content: currentPost.content,
              }}
            >
              <Form.Item
                className="mb-0"
                name="content"
                rules={[{ required: true, message: 'Your post cannot be empty.' }]}
              >
                <TextArea
                  autoSize={{ minRows: 2, maxRows: 6 }}
                  size="large"
                  ref={input => input && input.focus()}
                />
              </Form.Item>
            </Form>
          </div>
        </div>
      )
    }
    return <></>
  }

  const getPostModalFooter = type => {
    return (
      <div className="row justify-content-between">
        <div className="col-auto">
          <Button type="default" size="large" onClick={() => setShowPostModal(false)}>
            Close
          </Button>
        </div>
        <div className="col-auto">
          {type === 'edit' && (
            <Button type="primary" size="large" form="editPostForm" htmlType="submit">
              {`${getPostModalElements('title')}`}
            </Button>
          )}
          {type === 'delete' && (
            <Button danger size="large" onClick={() => postModalAction(type)}>
              {`${getPostModalElements('title')}`}
            </Button>
          )}
        </div>
      </div>
    )
  }

  const getPostModalElements = type => {
    switch (type) {
      case 'title':
        if (postModalOptions === 'edit') return 'Edit Post'
        if (postModalOptions === 'delete') return 'Delete Post'
        break
      case 'body':
        return getPostModalBody(postModalOptions)
      case 'footer':
        return getPostModalFooter(postModalOptions)
      default:
        return 'Error'
    }
    return 'Error'
  }

  return (
    <div>
      {size(posts) > 0 && (
        <PaginationWrapper
          setIsLoading={setIsLoading}
          totalData={posts}
          paginatedData={paginatedPosts}
          setPaginatedData={setPaginatedPosts}
          currentPageIdx={currentPageIdx}
          setCurrentPageIdx={setCurrentPageIdx}
          showLoadMore={showLoadMore}
          setShowLoadMore={setShowLoadMore}
          buttonStyle="primary"
          wrapperContent={
            size(paginatedPosts) > 0 &&
            map(paginatedPosts, post => {
              return (
                <SocialPostListItem
                  key={post.postId}
                  post={post}
                  user={user}
                  isLoading={isLoading}
                  showPostModalWithOptions={showPostModalWithOptions}
                  btnSize={btnSize}
                />
              )
            })
          }
        />
      )}
      {size(posts) === 0 && (
        <div className="card">
          <div className="card-body">
            <Empty />
          </div>
        </div>
      )}
      <Modal
        title={getPostModalElements('title')}
        visible={showPostModal}
        centered
        destroyOnClose
        okButtonProps={{ style: { display: 'none' } }}
        onCancel={() => setShowPostModal(false)}
        footer={getPostModalElements('footer')}
      >
        {getPostModalElements('body')}
      </Modal>
    </div>
  )
}

export default SocialPostList

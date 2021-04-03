import React, { useState } from 'react'
import { Avatar, Button, Divider, Form, Input, Space } from 'antd'
import { onFinishFailed, showNotification } from 'components/utils'
import { ADD_POST } from 'constants/text'
import { addPost } from 'services/social/posts'
import { isNil } from 'lodash'
import { ERROR, POST_ADD_ERR, POST_ADD_SUCCESS, SUCCESS } from 'constants/notifications'

const SocialAddPostCard = ({ user, getPostsSvc }) => {
  const { TextArea } = Input

  const [addPostForm] = Form.useForm()
  const [showPostField, setShowPostField] = useState(false)

  const addPostToFeed = async values => {
    const formValues = {
      content: values.content.trim(),
    }
    if (!isNil(user.accountId)) {
      const response = await addPost(user.accountId, formValues)
      if (response && response.success) {
        showNotification('success', SUCCESS, POST_ADD_SUCCESS)
        setShowPostField(false)
        addPostForm.resetFields()
        getPostsSvc()
      } else {
        showNotification('error', ERROR, POST_ADD_ERR)
      }
    }
  }

  const TogglePostField = () => {
    return (
      <div
        role="button"
        className="col btn border-0 text-left"
        tabIndex={0}
        onClick={() => setShowPostField(true)}
        onKeyDown={event => event.preventDefault()}
      >
        <span className="text-secondary">{ADD_POST}</span>
        <Divider className="m-0" />
      </div>
    )
  }

  const AddPostField = () => {
    return (
      <Form
        form={addPostForm}
        id="addPostForm"
        layout="vertical"
        hideRequiredMark
        onSubmit={e => e.preventDefault()}
        onFinish={addPostToFeed}
        onFinishFailed={onFinishFailed}
      >
        <Form.Item
          className="mb-0"
          name="content"
          rules={[{ required: true, message: 'Your post content cannot be empty.' }]}
        >
          <div className="row">
            <div className="col">
              <TextArea
                autoSize={{ minRows: 2, maxRows: 6 }}
                size="large"
                placeholder={ADD_POST}
                ref={input => input && input.focus()}
              />
            </div>
          </div>
        </Form.Item>
        <div className="row mt-2">
          <div className="col-12 text-right">
            <Space>
              <Button ghost type="primary" onClick={() => setShowPostField(false)}>
                Cancel
              </Button>
              <Button type="primary" form="addPostForm" htmlType="submit">
                Post
              </Button>
            </Space>
          </div>
        </div>
      </Form>
    )
  }

  return (
    <div className="card">
      <div className="card-body">
        <div className="row align-items-center">
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
            {!showPostField && <TogglePostField />}
            {showPostField && <AddPostField />}
          </div>
        </div>
      </div>
    </div>
  )
}

export default SocialAddPostCard

import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Button, Form, Input } from 'antd'
import { isNil } from 'lodash'
import { USER_TYPE_ENUM } from 'constants/constants'

const AboutCard = () => {
  const { TextArea } = Input
  const user = useSelector(state => state.user)
  const dispatch = useDispatch()

  const [currentHeadline, setCurrentHeadline] = useState(user.headline)
  const [showHeadline, setShowHeadline] = useState(isNil(user.headline))
  const [editHeadlineMode, setEditHeadlineMode] = useState(false)

  const [currentBio, setCurrentBio] = useState(user.bio)
  const [showBio, setShowBio] = useState(isNil(user.bio))
  const [editBioMode, setEditBioMode] = useState(false)

  const EmptyInformation = () => {
    return <span className="font-italic text-secondary">No information provided.</span>
  }

  const activateEditHeadline = activate => {
    if (activate) {
      setShowHeadline(false)
      setEditHeadlineMode(true)
    } else {
      setShowHeadline(false)
      setEditHeadlineMode(false)
    }
  }

  const onEditHeadline = values => {
    values.accountId = user.accountId
    values.isStudent = user.userType === USER_TYPE_ENUM.STUDENT
    values.updateHeadline = true
    setShowHeadline(false)
    setCurrentHeadline(values.headline)
    if (isNil(values.headline)) {
      setShowHeadline(true)
    }
    setEditHeadlineMode(false)
    dispatch({
      type: 'user/UPDATE_ABOUT',
      payload: values,
    })
  }

  const activateEditBio = activate => {
    if (activate) {
      setShowBio(false)
      setEditBioMode(true)
    } else {
      setShowBio(false)
      setEditBioMode(false)
    }
  }

  const onEditBio = values => {
    values.accountId = user.accountId
    values.isStudent = user.userType === USER_TYPE_ENUM.STUDENT
    values.updateHeadline = false
    setShowBio(false)
    setCurrentBio(values.bio)
    if (isNil(values.bio)) {
      setShowBio(true)
    }
    setEditBioMode(false)
    dispatch({
      type: 'user/UPDATE_ABOUT',
      payload: values,
    })
  }

  const onFinishFailed = errorInfo => {
    console.log('Failed:', errorInfo)
  }

  const EditHeadlineField = () => {
    return (
      <Form
        id="updateHeadlineForm"
        layout="vertical"
        hideRequiredMark
        onFinish={onEditHeadline}
        onFinishFailed={onFinishFailed}
        initialValues={{
          headline: user.headline,
        }}
      >
        <div className="row">
          <div className="col-12">
            <Form.Item
              name="headline"
              rules={[
                {
                  whitespace: true,
                  type: 'string',
                  required: true,
                  message: 'Please input a valid headline.',
                },
                {
                  max: 255,
                  message: 'Headline cannot contain more than 255 characters.',
                },
              ]}
            >
              <TextArea
                maxLength={255}
                placeholder="Edit Headline"
                bordered={false}
                value={currentHeadline}
              />
            </Form.Item>
          </div>
          <div className="col-4 col-md-2">
            <Button block type="primary" form="updateHeadlineForm" htmlType="submit">
              Save
            </Button>
          </div>
          <div className="col-4 col-md-2">
            <Button block type="default" onClick={() => activateEditHeadline(false)}>
              Cancel
            </Button>
          </div>
        </div>
      </Form>
    )
  }

  const EditBioField = () => {
    return (
      <Form
        id="updateBioForm"
        layout="vertical"
        hideRequiredMark
        onFinish={onEditBio}
        onFinishFailed={onFinishFailed}
        initialValues={{
          bio: user.bio,
        }}
      >
        <div className="row">
          <div className="col-12">
            <Form.Item
              name="bio"
              rules={[
                {
                  whitespace: true,
                  type: 'string',
                  required: true,
                  message: 'Please input a valid bio.',
                },
              ]}
            >
              <TextArea placeholder="Edit Bio" bordered={false} value={currentBio} />
            </Form.Item>
          </div>
          <div className="col-4 col-md-2">
            <Button block type="primary" form="updateBioForm" htmlType="submit">
              Save
            </Button>
          </div>
          <div className="col-4 col-md-2">
            <Button block type="default" onClick={() => activateEditBio(false)}>
              Cancel
            </Button>
          </div>
        </div>
      </Form>
    )
  }

  return (
    <div className="card">
      <div className="card-header pb-1">
        <div className="h3 font-weight-bold text-dark">About</div>
      </div>
      <div className="card-body">
        <div className="row align-items-center justify-content-between mb-2">
          <div className="col-auto">
            <span className="h4 text-dark">Headliner</span>
          </div>
          <div className="col-auto">
            {!editHeadlineMode && (
              <Button
                ghost
                type="primary"
                shape="round"
                icon={<i className="fe fe-edit-3" />}
                size="large"
                onClick={() => activateEditHeadline(true)}
              >
                &nbsp;&nbsp;Edit
              </Button>
            )}
          </div>
          <div className="col-12 mt-4">
            <div className="card">
              <div className="card-body">
                {!editHeadlineMode && showHeadline && <EmptyInformation />}
                {!editHeadlineMode && !showHeadline && user.headline}
                {editHeadlineMode && <EditHeadlineField />}
              </div>
            </div>
          </div>
        </div>
        <div className="row align-items-center justify-content-between">
          <div className="col-auto">
            <span className="h4 text-dark">Bio</span>
          </div>
          <div className="col-auto">
            {!editBioMode && (
              <Button
                ghost
                type="primary"
                shape="round"
                icon={<i className="fe fe-edit-3" />}
                size="large"
                onClick={() => activateEditBio(true)}
              >
                &nbsp;&nbsp;Edit
              </Button>
            )}
          </div>
          <div className="col-12 mt-4">
            <div className="card">
              <div className="card-body">
                {!editBioMode && showBio && <EmptyInformation />}
                {!editBioMode && !showBio && user.bio}
                {editBioMode && <EditBioField />}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AboutCard

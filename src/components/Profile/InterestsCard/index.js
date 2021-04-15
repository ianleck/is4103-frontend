import React, { useEffect, useState } from 'react'
import { Button, Empty, Form, Select, Tag } from 'antd'
import { useDispatch, useSelector } from 'react-redux'
import { isEmpty, map, size } from 'lodash'

const InterestsCard = ({ user, showEditTools }) => {
  const { Option } = Select
  const dispatch = useDispatch()
  const categories = useSelector(state => state.categories)

  const [showInterests, setShowInterests] = useState(isEmpty(user.Interests))
  const [editInterestsMode, setEditInterestsMode] = useState(false)

  const [updateInterestsForm] = Form.useForm()

  const activateEditInterests = activate => {
    if (activate) {
      setShowInterests(false)
      setEditInterestsMode(true)
    } else if (!isEmpty(user.Interests)) {
      setShowInterests(false)
      setEditInterestsMode(false)
    } else {
      setShowInterests(true)
      setEditInterestsMode(false)
    }
  }

  const onSaveInterests = values => {
    const formValues = {
      accountId: user.accountId,
      interests: values.interests,
    }
    dispatch({
      type: 'user/UPDATE_PROFILE',
      payload: formValues,
    })
    setShowInterests(false)
    if (isEmpty(values.interests)) {
      setShowInterests(true)
    }
    setEditInterestsMode(false)
  }

  const onFinishFailed = errorInfo => {
    console.log('Failed:', errorInfo)
  }

  const EditInterestsButton = () => {
    return (
      <Button
        ghost
        type="primary"
        shape="round"
        icon={<i className="fe fe-edit-3" />}
        size="large"
        onClick={() => activateEditInterests(true)}
      >
        &nbsp;&nbsp;Edit
      </Button>
    )
  }

  const SaveInterestsButtons = () => {
    return (
      <div className="col-12">
        <div className="row">
          <div className="col-6 col-md-5">
            <Button
              block
              type="primary"
              shape="round"
              icon={<i className="fe fe-save" />}
              size="middle"
              form="updateInterestsForm"
              htmlType="submit"
            >
              &nbsp;&nbsp;Save
            </Button>
          </div>
          <div className="col-6 col-md-5">
            <Button
              block
              ghost
              type="primary"
              shape="round"
              icon={<i className="fe fe-x" />}
              size="middle"
              onClick={() => activateEditInterests(false)}
            >
              &nbsp;&nbsp;Cancel
            </Button>
          </div>
        </div>
      </div>
    )
  }

  const SelectInterestsDropdown = () => {
    return (
      <Form
        id="updateInterestsForm"
        form={updateInterestsForm}
        layout="vertical"
        hideRequiredMark
        onFinish={onSaveInterests}
        onFinishFailed={onFinishFailed}
        style={{ display: !editInterestsMode && 'none' }}
      >
        <Form.Item
          name="interests"
          label="Interests"
          rules={[
            {
              required: true,
              message: 'Please indicate at least one interest.',
            },
          ]}
        >
          <Select
            showSearch
            mode="multiple"
            size="large"
            filterOption={(input, option) => {
              return option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
            }}
          >
            {map(categories, category => {
              const { categoryId, name } = category
              return (
                <Option key={categoryId} value={categoryId}>
                  {name}
                </Option>
              )
            })}
          </Select>
        </Form.Item>
      </Form>
    )
  }

  useEffect(() => {
    if (size(user.Interests) > 0) setShowInterests(false)
    if (showEditTools)
      updateInterestsForm.setFieldsValue({
        interests: map(user.Interests, interest => interest.categoryId),
      })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user.Interests])

  return (
    <div className="card">
      <div className="card-header pb-1">
        <div className="row align-items-center justify-content-between mb-2">
          <div className="col-auto">
            <span className="h3 font-weight-bold text-dark">
              Interests&nbsp;&nbsp;
              {isEmpty(user.Interests) && (
                <Tag color="error" className="text-uppercase align-top">
                  Needs Update
                </Tag>
              )}
            </span>
          </div>
          <div className="col-auto">
            {!editInterestsMode && !!showEditTools && <EditInterestsButton />}
          </div>
        </div>
      </div>
      <div className="card-body">
        <div className="row align-items-center justify-content-between">
          <div className="col-12">
            <span className="text-dark h3">
              {!editInterestsMode && showInterests && <Empty />}
              {!editInterestsMode &&
                !showInterests &&
                map(user.Interests, interest => {
                  return <Tag key={interest.categoryId}>{interest.name}</Tag>
                })}
              <SelectInterestsDropdown />
            </span>
          </div>
          {editInterestsMode && <SaveInterestsButtons />}
        </div>
      </div>
    </div>
  )
}

export default InterestsCard

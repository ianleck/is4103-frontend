import React, { useEffect, useState } from 'react'
import { Button, Empty, Form, Select } from 'antd'
import { useDispatch } from 'react-redux'
import { personalities } from 'constants/information'
import { isNil } from 'lodash'

const PersonalityCard = ({ user, showEditTools }) => {
  const { Option } = Select
  const dispatch = useDispatch()

  const [currentPersonality, setCurrentPersonality] = useState(user.personality)
  const [showPersonality, setShowPersonality] = useState(isNil(user.personality))
  const [editPersonalityMode, setEditPersonalityMode] = useState(false)

  useEffect(() => {
    if (user.personality) {
      setShowPersonality(isNil(user.personality))
    }
  }, [user.personality])

  const onChangePersonality = values => {
    setCurrentPersonality(values)
  }

  const activateEditPersonality = activate => {
    if (activate) {
      setShowPersonality(false)
      setEditPersonalityMode(true)
    } else if (!isNil(user.personality)) {
      setShowPersonality(false)
      setEditPersonalityMode(false)
      setCurrentPersonality(user.personality)
    } else {
      setShowPersonality(true)
      setEditPersonalityMode(false)
      setCurrentPersonality(user.personality)
    }
  }

  const EditPersonalityButton = () => {
    return (
      <Button
        ghost
        type="primary"
        shape="round"
        size="large"
        icon={<i className="fe fe-edit-3" />}
        onClick={() => activateEditPersonality(true)}
      >
        &nbsp;&nbsp;Edit
      </Button>
    )
  }

  const onSavePersonality = values => {
    const formValues = {
      accountId: user.accountId,
      personality: values.personality,
    }
    dispatch({
      type: 'user/UPDATE_PROFILE',
      payload: formValues,
    })
    setShowPersonality(false)
    setCurrentPersonality(values.personality)
    if (isNil(values.personality)) {
      setShowPersonality(true)
    }
    setEditPersonalityMode(false)
  }

  const onFinishFailed = errorInfo => {
    console.log('Failed:', errorInfo)
  }

  const SavePersonalityButtons = () => {
    return (
      <div className="col-12">
        <div className="row">
          <div className="col-5 col-md-4">
            <Button
              block
              type="primary"
              shape="round"
              icon={<i className="fe fe-save" />}
              size="middle"
              form="updatePersonalityForm"
              htmlType="submit"
            >
              &nbsp;&nbsp;Save
            </Button>
          </div>
          <div className="col-5 col-md-4">
            <Button
              block
              ghost
              type="primary"
              shape="round"
              icon={<i className="fe fe-x" />}
              size="middle"
              onClick={() => activateEditPersonality(false)}
            >
              &nbsp;&nbsp;Cancel
            </Button>
          </div>
        </div>
      </div>
    )
  }

  const SelectPersonalityDropdown = () => {
    return (
      <Form
        id="updatePersonalityForm"
        layout="vertical"
        hideRequiredMark
        onFinish={onSavePersonality}
        onFinishFailed={onFinishFailed}
        initialValues={{
          personality: currentPersonality,
        }}
      >
        <Form.Item name="personality" rules={[{ required: true }]}>
          <Select
            showSearch
            size="large"
            className="w-100"
            placeholder="Select an a personality trait"
            optionFilterProp="children"
            filterOption={(input, option) =>
              option.value.toLowerCase().indexOf(input.toLowerCase()) >= 0
            }
            onChange={onChangePersonality}
          >
            {personalities.map(item => (
              <Option value={item.personalityName} key={item.personalityId}>
                {item.personalityName}
              </Option>
            ))}
          </Select>
        </Form.Item>
      </Form>
    )
  }

  const ShowPersonalityTraits = () => {
    const currentPersonalityTrait = personalities.filter(obj => {
      return obj.personalityName === user.personality
    })
    if (currentPersonalityTrait.length > 0) {
      return (
        <div className="row align-items-center text-dark">
          <div className="col-12 mt-2">
            <span className="font-size-18">
              <strong>{currentPersonalityTrait[0].personalityTraits}</strong>
            </span>
            <br />
            <span>{currentPersonalityTrait[0].personalityDescription}</span>
          </div>
          <div className="col-12 text-right">
            <span className="align-bottom">Powered by&nbsp;&nbsp;</span>
            <a href="https://www.16personalities.com/">
              <img
                width="125"
                src="/resources/images/16personalities.svg"
                alt="16 Personalities Logo"
              />
            </a>
          </div>
        </div>
      )
    }

    return <div />
  }

  return (
    <div className="card">
      <div className="card-header pb-1">
        <div className="row align-items-center justify-content-between mb-2">
          <div className="col-auto">
            <span className="h3 font-weight-bold text-dark">My Personality</span>
          </div>
          <div className="col-auto">
            {!editPersonalityMode && !!showEditTools && <EditPersonalityButton />}
          </div>
        </div>
      </div>
      <div className="card-body">
        <div className="row align-items-center justify-content-between">
          <div className="col-12">
            <span className="text-dark h3">
              {!editPersonalityMode && showPersonality && <Empty />}
              {!editPersonalityMode && !showPersonality && user.personality}
              {editPersonalityMode && <SelectPersonalityDropdown />}
            </span>
          </div>
          {editPersonalityMode && <SavePersonalityButtons />}
        </div>
        {!editPersonalityMode && !showPersonality && <ShowPersonalityTraits />}
      </div>
    </div>
  )
}

export default PersonalityCard

import React, { useEffect, useState } from 'react'
import { Button, Empty, Form, Select } from 'antd'
import { occupations } from 'constants/information'
import { useDispatch } from 'react-redux'
import { isNil } from 'lodash'

const OccupationCard = ({ user, showEditTools }) => {
  const { Option } = Select
  const dispatch = useDispatch()

  const [currentOccupation, setCurrentOccupation] = useState(user.occupation)
  const [showOccupation, setShowOccupation] = useState(isNil(user.occupation))
  const [editOccupationMode, setEditOccupationMode] = useState(false)

  useEffect(() => {
    if (user.occupation) {
      setShowOccupation(isNil(user.occupation))
    }
  }, [user.occupation])

  const onChangeOccupation = values => {
    setCurrentOccupation(values)
  }

  const activateEditOccupation = activate => {
    if (activate) {
      setShowOccupation(false)
      setEditOccupationMode(true)
    } else if (!isNil(user.occupation)) {
      setShowOccupation(false)
      setEditOccupationMode(false)
      setCurrentOccupation(user.occupation)
    } else {
      setShowOccupation(true)
      setEditOccupationMode(false)
      setCurrentOccupation(user.occupation)
    }
  }

  const onSaveOccupation = values => {
    const formValues = {
      accountId: user.accountId,
      occupation: values.occupation,
    }
    dispatch({
      type: 'user/UPDATE_PROFILE',
      payload: formValues,
    })
    setShowOccupation(false)
    setCurrentOccupation(values.occupation)
    if (isNil(values.occupation)) {
      setShowOccupation(true)
    }
    setEditOccupationMode(false)
  }

  const onFinishFailed = errorInfo => {
    console.log('Failed:', errorInfo)
  }

  const EditOccupationButton = () => {
    return (
      <Button
        ghost
        type="primary"
        shape="round"
        icon={<i className="fe fe-edit-3" />}
        size="large"
        onClick={() => activateEditOccupation(true)}
      >
        &nbsp;&nbsp;Edit
      </Button>
    )
  }

  const SaveOccupationButtons = () => {
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
              form="updateOccupationForm"
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
              onClick={() => activateEditOccupation(false)}
            >
              &nbsp;&nbsp;Cancel
            </Button>
          </div>
        </div>
      </div>
    )
  }

  const SelectOccupationDropdown = () => {
    return (
      <Form
        id="updateOccupationForm"
        layout="vertical"
        hideRequiredMark
        onFinish={onSaveOccupation}
        onFinishFailed={onFinishFailed}
        initialValues={{
          occupation: currentOccupation,
        }}
      >
        <Form.Item
          name="occupation"
          rules={[{ required: true, message: 'Please select your current occupation.' }]}
        >
          <Select
            showSearch
            className="w-100"
            placeholder="Select an occupation"
            optionFilterProp="children"
            filterOption={(input, option) =>
              option.value.toLowerCase().indexOf(input.toLowerCase()) >= 0
            }
            onChange={onChangeOccupation}
          >
            {occupations.map(item => (
              <Option value={item.occupationName} key={item.occupationId}>
                {item.occupationName}
              </Option>
            ))}
          </Select>
        </Form.Item>
      </Form>
    )
  }

  return (
    <div className="card">
      <div className="card-header pb-1">
        <div className="row align-items-center justify-content-between mb-2">
          <div className="col-auto">
            <span className="h3 font-weight-bold text-dark">Occupation</span>
          </div>
          <div className="col-auto">
            {!editOccupationMode && !!showEditTools && <EditOccupationButton />}
          </div>
        </div>
      </div>
      <div className="card-body">
        <div className="row align-items-center justify-content-between">
          <div className="col-12">
            <span className="text-dark h3">
              {!editOccupationMode && showOccupation && <Empty />}
              {!editOccupationMode && !showOccupation && user.occupation}
              {editOccupationMode && <SelectOccupationDropdown />}
            </span>
          </div>
          {editOccupationMode && <SaveOccupationButtons />}
        </div>
      </div>
    </div>
  )
}

export default OccupationCard

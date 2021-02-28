import React, { useState } from 'react'
import { Button, Empty, Form, Select } from 'antd'
import { occupations } from 'constants/information'
import { useDispatch, useSelector } from 'react-redux'
import { isNil } from 'lodash'
import { USER_TYPE_ENUM } from 'constants/constants'

const OccupationCard = () => {
  const { Option } = Select
  const user = useSelector(state => state.user)
  const dispatch = useDispatch()

  const [currentOccupation, setCurrentOccupation] = useState(user.occupation)
  const [showOccupation, setShowOccupation] = useState(isNil(user.occupation))
  const [editOccupationMode, setEditOccupationMode] = useState(false)

  const onChangeOccupation = values => {
    setCurrentOccupation(values)
  }

  const activateEditOccupation = activate => {
    if (activate) {
      setShowOccupation(false)
      setEditOccupationMode(true)
    } else {
      setShowOccupation(true)
      setEditOccupationMode(false)
      setCurrentOccupation(user.occupation)
    }
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

  const onSaveOccupation = values => {
    values.accountId = user.accountId
    values.isStudent = user.userType === USER_TYPE_ENUM.STUDENT
    values.isIndustry = false
    dispatch({
      type: 'user/UPDATE_WORK_DETAILS',
      payload: values,
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

  const SaveOccupationButtons = () => {
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
              form="updateOccupationForm"
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
        <Form.Item name="occupation" rules={[{ required: true }]}>
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
          <div className="col-auto">{!editOccupationMode && <EditOccupationButton />}</div>
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

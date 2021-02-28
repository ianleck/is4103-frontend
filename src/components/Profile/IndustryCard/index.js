import React, { useState } from 'react'
import { Button, Empty, Form, Select } from 'antd'
import { industries } from 'constants/information'
import { useDispatch, useSelector } from 'react-redux'
import { isNil } from 'lodash'
import { USER_TYPE_ENUM } from 'constants/constants'

const IndustryCard = () => {
  const { Option } = Select
  const user = useSelector(state => state.user)
  const dispatch = useDispatch()

  const [currentIndustry, setCurrentIndustry] = useState(user.industry)
  const [showIndustry, setShowIndustry] = useState(!isNil(user.industry))
  const [editIndustryMode, setEditIndustryMode] = useState(false)

  const onChangeIndustry = values => {
    setCurrentIndustry(values)
  }

  const activateEditIndustry = activate => {
    if (activate) {
      setShowIndustry(true)
      setEditIndustryMode(true)
    } else {
      setShowIndustry(true)
      setEditIndustryMode(false)
      setCurrentIndustry(user.industry)
    }
  }

  const EditIndustryButton = () => {
    return (
      <Button
        ghost
        type="primary"
        shape="round"
        icon={<i className="fe fe-edit-3" />}
        size="large"
        onClick={() => activateEditIndustry(true)}
      >
        &nbsp;&nbsp;Edit
      </Button>
    )
  }

  const onSaveIndustry = values => {
    values.accountId = user.accountId
    values.isStudent = user.userType === USER_TYPE_ENUM.STUDENT
    values.isIndustry = true
    dispatch({
      type: 'user/UPDATE_WORK_DETAILS',
      payload: values,
    })
    setShowIndustry(true)
    setCurrentIndustry(values.industry)
    if (isNil(values.industry)) {
      setShowIndustry(true)
    }
    setEditIndustryMode(false)
  }

  const onFinishFailed = errorInfo => {
    console.log('Failed:', errorInfo)
  }

  const SaveIndustryButtons = () => {
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
              form="updateIndustryForm"
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
              onClick={() => activateEditIndustry(false)}
            >
              &nbsp;&nbsp;Cancel
            </Button>
          </div>
        </div>
      </div>
    )
  }

  const SelectIndustryDropdown = () => {
    return (
      <Form
        id="updateIndustryForm"
        layout="vertical"
        hideRequiredMark
        onFinish={onSaveIndustry}
        onFinishFailed={onFinishFailed}
        initialValues={{
          industry: currentIndustry,
        }}
      >
        <Form.Item name="industry" rules={[{ required: true }]}>
          <Select
            showSearch
            className="w-100"
            placeholder="Select an industry"
            optionFilterProp="children"
            filterOption={(input, option) =>
              option.value.toLowerCase().indexOf(input.toLowerCase()) >= 0
            }
            onChange={onChangeIndustry}
          >
            {industries.map(item => (
              <Option value={item.industryName} key={item.industryId}>
                {item.industryName}
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
            <span className="h3 font-weight-bold text-dark">Industry</span>
          </div>
          <div className="col-auto">{!editIndustryMode && <EditIndustryButton />}</div>
        </div>
      </div>
      <div className="card-body">
        <div className="row align-items-center justify-content-between">
          <div className="col-12">
            <span className="text-dark h3">
              {!editIndustryMode && !showIndustry && <Empty />}
              {!editIndustryMode && showIndustry && user.industry}
              {editIndustryMode && <SelectIndustryDropdown />}
            </span>
          </div>
          {editIndustryMode && <SaveIndustryButtons />}
        </div>
      </div>
    </div>
  )
}

export default IndustryCard

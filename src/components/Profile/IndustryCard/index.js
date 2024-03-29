import React, { useEffect, useState } from 'react'
import { Button, Empty, Form, Select } from 'antd'
import { industries } from 'constants/information'
import { useDispatch } from 'react-redux'
import { isNil } from 'lodash'

const IndustryCard = ({ user, showEditTools }) => {
  const { Option } = Select
  const dispatch = useDispatch()

  const [currentIndustry, setCurrentIndustry] = useState(user.industry)
  const [showIndustry, setShowIndustry] = useState(isNil(user.industry))
  const [editIndustryMode, setEditIndustryMode] = useState(false)

  useEffect(() => {
    if (user.industry) {
      setShowIndustry(isNil(user.industry))
    }
  }, [user.industry])

  const onChangeIndustry = values => {
    setCurrentIndustry(values)
  }

  const activateEditIndustry = activate => {
    if (activate) {
      setShowIndustry(false)
      setEditIndustryMode(true)
    } else if (!isNil(user.industry)) {
      setShowIndustry(false)
      setEditIndustryMode(false)
      setCurrentIndustry(user.industry)
    } else {
      setShowIndustry(true)
      setEditIndustryMode(false)
      setCurrentIndustry(user.industry)
    }
  }

  const onSaveIndustry = values => {
    const formValues = {
      accountId: user.accountId,
      industry: values.industry,
    }
    dispatch({
      type: 'user/UPDATE_PROFILE',
      payload: formValues,
    })
    setShowIndustry(false)
    setCurrentIndustry(values.industry)
    if (isNil(values.industry)) {
      setShowIndustry(true)
    }
    setEditIndustryMode(false)
  }

  const onFinishFailed = errorInfo => {
    console.log('Failed:', errorInfo)
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

  const SaveIndustryButtons = () => {
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
              form="updateIndustryForm"
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
        <Form.Item
          name="industry"
          rules={[{ required: true, message: 'Please select an industry you are working in.' }]}
        >
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
          <div className="col-auto">
            {!editIndustryMode && !!showEditTools && <EditIndustryButton />}
          </div>
        </div>
      </div>
      <div className="card-body">
        <div className="row align-items-center justify-content-between">
          <div className="col-12">
            <span className="text-dark h3">
              {!editIndustryMode && showIndustry && <Empty />}
              {!editIndustryMode && !showIndustry && user.industry}
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

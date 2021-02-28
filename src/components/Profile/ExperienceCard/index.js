import React, { useState } from 'react'
import { Button, DatePicker, Empty, Form, Input, Modal } from 'antd'
import { useDispatch, useSelector } from 'react-redux'
import moment from 'moment'
import { isNil } from 'lodash'

const ExperienceCard = () => {
  const user = useSelector(state => state.user)
  const isExperienceEmpty = user.Experience.length === 0
  const dispatch = useDispatch()
  const [showAddExperience, setShowAddExperience] = useState(false)

  const onFinishFailed = errorInfo => {
    console.log('Failed:', errorInfo)
  }

  const onAddExperience = values => {
    values.accountId = user.accountId
    dispatch({
      type: 'user/ADD_EXPERIENCE',
      payload: values,
    })
  }

  const UserExperiences = () => {
    return user.Experience.map(item => (
      <div className="card" key={item.experienceId}>
        <div className="card-body">
          <div className="row justify-content-between align-items-center text-dark">
            <div className="col-auto">
              <span>
                {moment(item.dateStart).format('DD MMM YYYY')}
                {' to '}
                {moment(item.dateEnd).format('DD MMM YYYY')}
              </span>
            </div>
            <div className="col-auto">
              <Button type="default" icon={<i className="fe fe-edit" />}>
                &nbsp;&nbsp;Edit
              </Button>
            </div>
          </div>
          <div className="row text-dark align-items-center">
            <div className="col-12 h4 font-weight-bold">
              <a
                className="text-dark align-items-center"
                href={!isNil(item.companyUrl) ? `https\://${item.companyUrl}` : '#'}
              >
                {item.companyName}&nbsp;&nbsp;
                {!isNil(item.companyUrl) ? (
                  <span className="badge badge-pill badge-dark align-top">View</span>
                ) : (
                  ''
                )}
              </a>
            </div>
            <div className="col-12 mt-3 h5 font-weight-bold">
              <span>{item.role}</span>
            </div>
            <div className="col-12">
              <span>{item.description}</span>
            </div>
          </div>
        </div>
      </div>
    ))
  }

  const saveFormFooter = (
    <div className="row justify-content-between">
      <div className="col-auto">
        <Button
          ghost
          type="primary"
          size="large"
          onClick={() => setShowAddExperience(false)}
          className=""
        >
          Close
        </Button>
      </div>
      <div className="col-auto">
        <Button type="primary" form="addExperienceForm" htmlType="submit" size="large" className="">
          Submit
        </Button>
      </div>
    </div>
  )

  return (
    <div className="card">
      <div className="card-header pb-1">
        <div className="row align-items-center justify-content-between mb-2">
          <div className="col-auto">
            <span className="h3 font-weight-bold text-dark">My Experience</span>
          </div>
          <div className="col-auto">
            <Button
              ghost
              type="primary"
              shape="round"
              size="large"
              icon={<i className="fe fe-plus" />}
              onClick={() => setShowAddExperience(true)}
            >
              &nbsp;&nbsp;Add
            </Button>
          </div>
        </div>
      </div>
      <div className="card-body">
        {isExperienceEmpty && <Empty />}
        {!isExperienceEmpty && <UserExperiences />}
      </div>
      <Modal
        title="Add an experience"
        visible={showAddExperience}
        cancelText="Close"
        centered
        okButtonProps={{ style: { display: 'none' } }}
        onCancel={() => setShowAddExperience(false)}
        footer={saveFormFooter}
      >
        <Form
          id="addExperienceForm"
          layout="vertical"
          hideRequiredMark
          onFinish={onAddExperience}
          onFinishFailed={onFinishFailed}
          initialValues={{
            role: 'I am Leticia',
            description: 'Leticia is me',
            companyName: 'Helpers Incorporated.',
            companyUrl: 'meowmeow',
          }}
        >
          <div className="row">
            <div className="col-12">
              <Form.Item
                name="role"
                label="Role"
                rules={[{ required: true, message: 'Please input your role at your experience.' }]}
              >
                <Input />
              </Form.Item>
            </div>
            <div className="col-6">
              <Form.Item
                name="dateStart"
                label="Date Start"
                rules={[{ required: true, message: 'Start date of experience is required.' }]}
              >
                <DatePicker
                  renderExtraFooter={() => 'Enter the date you started your experience.'}
                />
              </Form.Item>
            </div>
            <div className="col-6">
              <Form.Item
                name="dateEnd"
                label="Date Ended"
                rules={[{ required: true, message: 'End date of experience is required.' }]}
              >
                <DatePicker
                  renderExtraFooter={() => 'Enter the date you end/will end your experience.'}
                />
              </Form.Item>
            </div>
            <div className="col-12">
              <Form.Item
                name="description"
                label="Description"
                rules={[
                  {
                    required: true,
                    message: 'Please provide a short description about your experience.',
                  },
                ]}
              >
                <Input />
              </Form.Item>
            </div>
            <div className="col-12">
              <Form.Item
                name="companyName"
                label="Company Name"
                rules={[
                  {
                    required: true,
                    message: 'Please provide the name of the company you worked at',
                  },
                ]}
              >
                <Input />
              </Form.Item>
            </div>
            <div className="col-12">
              <Form.Item name="companyUrl" label="Link to Company Portfolio">
                <Input />
              </Form.Item>
            </div>
          </div>
        </Form>
      </Modal>
    </div>
  )
}

export default ExperienceCard

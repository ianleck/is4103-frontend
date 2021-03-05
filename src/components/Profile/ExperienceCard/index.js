import React, { useEffect, useState } from 'react'
import { Button, DatePicker, Empty, Form, Input, Modal, notification, Popconfirm } from 'antd'
import { useDispatch } from 'react-redux'
import moment from 'moment'
import { isNil } from 'lodash'
import * as jwt from 'services/jwt'

const ExperienceCard = ({ user, showEditTools }) => {
  const { TextArea } = Input

  let isExperienceEmpty = false
  if (!isNil(user.Experience)) isExperienceEmpty = user.Experience.length === 0
  const dispatch = useDispatch()
  // Add Experience Modal
  const [showAddExperience, setShowAddExperience] = useState(false)
  // Edit Experience Modal
  const [showEditExperience, setShowEditExperience] = useState(false)
  const [currentEditExpObj, setCurrentEditExpObj] = useState('')
  const [editExperienceForm] = Form.useForm()

  useEffect(() => {
    const getProfile = async () => {
      if (!isNil(user.accountId)) {
        const userRsp = await jwt.getProfile(user.accountId)
        dispatch({
          type: 'user/SET_STATE',
          payload: {
            Experience: userRsp.Experience,
          },
        })
      }
    }
    getProfile()
  }, [dispatch, user.accountId])

  const sortExperienceByDate = () => {
    if (user) {
      if (!isNil(user.Experience)) {
        return user.Experience.sort(
          (a, b) => new Date(b.dateStart).getTime() - new Date(a.dateStart).getTime(),
        )
      }
    }
    return []
  }

  const onFinishFailed = errorInfo => {
    console.log('Failed:', errorInfo)
  }

  const validateDates = (dateStart, dateEnd) => {
    if (!isNil(dateStart) && !isNil(dateEnd)) {
      if (
        moment(dateEnd)
          .startOf('day')
          .isSameOrAfter(moment(dateStart).startOf('day'))
      ) {
        return true
      }
    }
    return false
  }

  const onAddExperience = values => {
    const formValues = {
      accountId: user.accountId,
      role: values.role.trim(),
      dateStart: values.dateStart,
      dateEnd: values.dateEnd,
      description: values.description.trim(),
      companyName: values.companyName.trim(),
      companyUrl: values.companyUrl ? values.companyUrl.trim() : '',
    }
    dispatch({
      type: 'user/ADD_EXPERIENCE',
      payload: formValues,
    })
    setShowAddExperience(false)
  }

  const onEditExperience = values => {
    const formValues = {
      accountId: user.accountId,
      experienceId: currentEditExpObj.experienceId,
      role: values.role.trim(),
      dateStart: values.dateStart,
      dateEnd: values.dateEnd,
      description: values.description.trim(),
      companyName: values.companyName.trim(),
      companyUrl: values.companyUrl ? values.companyUrl.trim() : '',
    }
    dispatch({
      type: 'user/EDIT_EXPERIENCE',
      payload: formValues,
    })
    setShowEditExperience(false)
  }

  const onDeleteExperience = () => {
    if (!isNil(user.accountId) && !isNil(currentEditExpObj.experienceId)) {
      dispatch({
        type: 'user/DELETE_EXPERIENCE',
        payload: {
          accountId: user.accountId,
          experienceId: currentEditExpObj.experienceId,
        },
      })
      setShowEditExperience(false)
    }
  }

  const showEditExperienceModal = experience => {
    if (!isNil(experience)) {
      setCurrentEditExpObj(experience)
      editExperienceForm.setFieldsValue({
        role: experience.role,
        description: experience.description,
        dateStart: moment(experience.dateStart),
        dateEnd: moment(experience.dateEnd),
        companyName: experience.companyName,
        companyUrl: experience.companyUrl,
      })
      setShowEditExperience(true)
    } else {
      notification.error({
        message: 'Error editing currently selected experience.',
      })
    }
  }

  const editExpFormFooter = (
    <div className="row justify-content-between">
      <div className="col-auto">
        <Button
          type="default"
          size="large"
          onClick={() => setShowEditExperience(false)}
          className=""
        >
          Close
        </Button>
      </div>
      <div className="col-auto">
        <Button
          type="primary"
          form="editExperienceForm"
          htmlType="submit"
          size="large"
          className=""
        >
          Update
        </Button>
      </div>
    </div>
  )

  const UserExperiences = () => {
    return sortExperienceByDate().map(item => (
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
              {!!showEditTools && (
                <Button
                  type="default"
                  icon={<i className="fe fe-edit" />}
                  onClick={() => showEditExperienceModal(item)}
                >
                  &nbsp;&nbsp;Edit
                </Button>
              )}
            </div>
          </div>
          <div className="row mt-2 text-dark align-items-center">
            <div className="col-12 h4 font-weight-bold">
              <a
                className="text-dark align-items-center"
                href={!isNil(item.companyUrl) ? item.companyUrl : '#'}
              >
                {item.companyName}&nbsp;&nbsp;
                {!isNil(item.companyUrl) ? (
                  <span className="badge badge-pill badge-dark  align-top">View</span>
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

  const addExpFormFooter = (
    <div className="row justify-content-between">
      <div className="col-auto">
        <Button
          type="default"
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
            {!!showEditTools && (
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
            )}
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
        footer={addExpFormFooter}
      >
        <Form
          id="addExperienceForm"
          layout="vertical"
          hideRequiredMark
          onSubmit={e => e.preventDefault()}
          onFinish={onAddExperience}
          onFinishFailed={onFinishFailed}
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
                hasFeedback
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
                dependencies={['dateStart']}
                hasFeedback
                rules={[
                  { required: true, message: 'End date of experience is required.' },
                  ({ getFieldValue }) => ({
                    validator(_, value) {
                      if (validateDates(getFieldValue('dateStart'), value)) return Promise.resolve()
                      return Promise.reject(new Error('Date End cannot be earlier than Date Start'))
                    },
                  }),
                ]}
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
                <TextArea />
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
      <Modal
        title="Edit experience"
        visible={showEditExperience}
        cancelText="Close"
        centered
        okButtonProps={{ style: { display: 'none' } }}
        onCancel={() => setShowEditExperience(false)}
        footer={editExpFormFooter}
      >
        <Form
          form={editExperienceForm}
          id="editExperienceForm"
          layout="vertical"
          hideRequiredMark
          onFinish={onEditExperience}
          onFinishFailed={onFinishFailed}
          initialValues={{
            role: currentEditExpObj.role,
            description: currentEditExpObj.description,
            dateStart: moment(currentEditExpObj.dateStart),
            dateEnd: moment(currentEditExpObj.dateEnd),
            companyName: currentEditExpObj.companyName,
            companyUrl: currentEditExpObj.companyUrl,
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
                dependencies={['dateStart']}
                hasFeedback
                rules={[
                  { required: true, message: 'End date of experience is required.' },
                  ({ getFieldValue }) => ({
                    validator(_, value) {
                      if (validateDates(getFieldValue('dateStart'), value)) return Promise.resolve()
                      return Promise.reject(new Error('Date End cannot be earlier than Date Start'))
                    },
                  }),
                ]}
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
                <TextArea />
              </Form.Item>
            </div>
            <div className="col-12">
              <Form.Item name="companyName" label="Company Name">
                <Input />
              </Form.Item>
            </div>
            <div className="col-12">
              <Form.Item name="companyUrl" label="Link to Company Portfolio">
                <Input />
              </Form.Item>
            </div>
            <div className="col-12">
              <Form.Item className="mb-1">
                <Popconfirm
                  title="Do you wish to delete this experience?"
                  onConfirm={onDeleteExperience}
                  okText="Delete"
                  okType="danger"
                  okButtonProps={{ loading: user.loading }}
                >
                  <Button block type="danger">
                    Delete experience
                  </Button>
                </Popconfirm>
              </Form.Item>
            </div>
          </div>
        </Form>
      </Modal>
    </div>
  )
}

export default ExperienceCard

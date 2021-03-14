import React, { useState, useEffect } from 'react'
import { Button, Form, Input, notification } from 'antd'
import { ArrowLeftOutlined } from '@ant-design/icons'
import { useParams, useHistory, useLocation } from 'react-router-dom'
import {
  createMentorshipApplication,
  updateMentorshipApplication,
} from 'services/mentorshipApplications'

const formItemLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 4 },
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 12 },
  },
}

const ApplyListingForm = () => {
  const { id } = useParams()
  const [form] = Form.useForm()
  const history = useHistory()
  const [prevApplication, setPrevApplication] = useState(null)
  const location = useLocation()

  useEffect(() => {
    console.log('state ==', location.state) // for location state
    const prevApplicationData = location.state
    const setInitialValues = values => {
      console.log('values =', values)
      console.log('prevApplication =', prevApplication)
      form.setFieldsValue({
        ...values,
      })
    }
    if (prevApplicationData) {
      setPrevApplication(prevApplicationData)
      setInitialValues(prevApplicationData)
    }
  }, [form, location.state, prevApplication])

  const onSubmit = () => {
    form.validateFields().then(values => {
      // if existing data, send update
      if (prevApplication) {
        updateMentorshipApplication(prevApplication.mentorshipContractId, values).then(res => {
          if (res) {
            notification.success({ message: res.message })
            history.goBack()
          }
        })
      } else {
        createMentorshipApplication(id, values).then(res => {
          if (res) {
            notification.success({ message: res.message })
            history.goBack()
          }
        })
      }
    })
  }

  return (
    <div>
      <div className="row">
        <div className="col-12">
          <Button
            type="primary"
            size="large"
            shape="round"
            onClick={() => history.goBack()}
            icon={<ArrowLeftOutlined />}
          >
            Back
          </Button>
        </div>
      </div>
      <div className="row mt-4">
        <div className="col-12">
          <div className="card">
            <div className="card-header pb-1">
              <div className="h3 font-weight-bold text-dark">Mentorship Application Form</div>
            </div>
            <div className="card-body">
              <div className="row">
                <div className="col-12">
                  <Form form={form} {...formItemLayout} layout="vertical">
                    <Form.Item name="statement" label="Description">
                      <Input.TextArea
                        rows={5}
                        placeholder="Why do you want to apply for this mentorship?"
                      />
                    </Form.Item>
                    <Button onClick={() => onSubmit()} type="primary">
                      Submit
                    </Button>
                  </Form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ApplyListingForm

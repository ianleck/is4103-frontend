import React, { useState, useEffect } from 'react'
import { ArrowLeftOutlined } from '@ant-design/icons'
import { useParams, useHistory, useLocation } from 'react-router-dom'
// import { getMentorshipListings } from 'services/mentorshipListing'
import {
  createMentorshipApplication,
  updateMentorshipApplication,
} from 'services/mentorshipApplications'
import { Button, Card, Form, Input, notification } from 'antd'

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
  const setInitialValues = values => {
    console.log('values =', values)
    console.log('prevApplication =', prevApplication)
    form.setFieldsValue({
      ...values,
    })
  }

  useEffect(() => {
    console.log('state ==', location.state) // for location state
    const prevApplicationData = location.state
    if (prevApplicationData) {
      setPrevApplication(prevApplicationData)
      setInitialValues(prevApplicationData)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.state])

  const onSubmit = () => {
    form.validateFields().then(values => {
      // if existing data, send update
      if (prevApplication) {
        updateMentorshipApplication(prevApplication.mentorshipContractId, values).then(res => {
          if (res) {
            notification.success({ message: res.message })
          }
        })
      } else {
        createMentorshipApplication(id, values).then(res => {
          if (res) {
            notification.success({ message: res.message })
          }
        })
      }
    })
  }

  return (
    <div>
      <div className="row">
        <Button
          type="primary"
          size="small"
          shape="round"
          onClick={() => history.goBack()}
          icon={<ArrowLeftOutlined />}
        >
          Back
        </Button>
      </div>
      <div
        style={{
          marginBottom: '10px',
          fontSize: '18px',
          color: 'black',
          marginTop: '20px',
          fontWeight: 500,
        }}
      >
        Mentorship Application Form
      </div>
      <Card>
        <Form form={form} {...formItemLayout} layout="vertical">
          <Form.Item name="statement" label="Description">
            <Input.TextArea rows={5} placeholder="Why do you want to apply for this mentorship?" />
          </Form.Item>
          <Button onClick={() => onSubmit()} type="primary">
            Submit
          </Button>
        </Form>
      </Card>
    </div>
  )
}

export default ApplyListingForm

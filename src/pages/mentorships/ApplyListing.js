import React from 'react'
import { useParams } from 'react-router-dom'
import { Helmet } from 'react-helmet'
// import { getMentorshipListings } from 'services/mentorshipListing'
import { createMentorshipApplication } from 'services/mentorshipApplications'

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

const ApplyListing = () => {
  const { id } = useParams()
  const [form] = Form.useForm()

  const onSubmit = () => {
    form.validateFields().then(values => {
      createMentorshipApplication(id, values).then(res => {
        if (res) {
          notification.success({ message: res.message })
        }
      })
    })
  }

  return (
    <div>
      <Helmet title="Mentorship Listings" />
      <div
        className="row"
        style={{ fontSize: '18px', color: 'black', marginBottom: '10px', fontWeight: 500 }}
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

export default ApplyListing

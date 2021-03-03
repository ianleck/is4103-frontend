import React from 'react'
import { useParams } from 'react-router-dom'
// import { getMentorshipListings } from 'services/mentorshipListing'
import { createMentorshipApplication } from 'services/mentorshipApplications'
import { Button, Card, Form, Input, notification } from 'antd'
// import { useLocation } from 'react-router-dom'; // to get data from update application
// import { useHistory } from 'react-router-dom';

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
  // history.push({
  //   pathname: '/home',
  //   search: '?update=true',  // query string
  //   state: {  // location state
  //     update: true,
  //   },
  // });
  // const location = useLocation();
  // console.log(location.state.update)  // for location state

  const onSubmit = () => {
    form.validateFields().then(values => {
      // if existing data, send update

      createMentorshipApplication(id, values).then(res => {
        if (res) {
          notification.success({ message: res.message })
        }
      })
    })
  }

  return (
    <div>
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

export default ApplyListingForm

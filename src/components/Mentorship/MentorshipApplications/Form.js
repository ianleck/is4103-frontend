import React from 'react'
import { ArrowLeftOutlined } from '@ant-design/icons'
import { useParams, useHistory } from 'react-router-dom'
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
  const history = useHistory()
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

  const onBack = (e, _id) => {
    e.preventDefault()
    const path = `/student/mentorship-listing/${_id}`
    history.push(path)
  }

  return (
    <div>
      <div className="row">
        <Button
          type="primary"
          size="small"
          shape="round"
          onClick={e => onBack(e, id)}
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

import React from 'react'
import { useHistory } from 'react-router-dom'
import { Button, Form, Input, Select, Space, Upload } from 'antd'
import { ArrowLeftOutlined, SaveOutlined, UploadOutlined } from '@ant-design/icons'
import TextArea from 'antd/lib/input/TextArea'

const SenseiCreateCourse = () => {
  const history = useHistory()
  const onBack = e => {
    e.preventDefault()
    history.goBack()
  }

  const formItemLayout = {
    labelCol: {
      xs: { span: 24 },
      sm: { span: 5 },
    },
    wrapperCol: {
      xs: { span: 24 },
      sm: { span: 12 },
    },
  }

  return (
    <div>
      <div className="row pt-2">
        <div className="col-12 col-md-3 col-lg-2 mt-4 mt-md-0">
          <Button
            block
            type="primary"
            size="large"
            shape="round"
            onClick={onBack}
            icon={<ArrowLeftOutlined />}
          >
            Back
          </Button>
        </div>
      </div>

      <div className="row mt-4">
        <div className="col-12">
          <div className="card">
            <div className="card-header">
              <div className="row align-items-center justify-content-between">
                <div className="col-auto">
                  <span className="text-dark text-uppercase h3">
                    <strong>Create New Course</strong>
                  </span>
                </div>
                <div className="col-12 col-md-auto mt-4 mt-md-0 text-center text-md-right">
                  <Space size="large">
                    <Button ghost type="primary" size="large" shape="round" icon={<SaveOutlined />}>
                      Save Draft
                    </Button>
                    <Button type="primary" size="large" shape="round" icon={<UploadOutlined />}>
                      Submit
                    </Button>
                  </Space>
                </div>
              </div>
            </div>
            <div className="card-body">
              <div className="row">
                <div className="col-12">
                  <Form
                    {...formItemLayout}
                    id="createCourseForm"
                    layout="vertical"
                    hideRequiredMark
                  >
                    <Form.Item
                      name="title"
                      label="Title"
                      rules={[
                        { required: true, message: 'Please provide the title of your course.' },
                      ]}
                    >
                      <Input size="large" />
                    </Form.Item>
                    <Form.Item
                      name="subtitle"
                      label="Subtitle"
                      rules={[
                        { required: true, message: 'Please provide the subtitle of your course.' },
                      ]}
                    >
                      <Input size="large" />
                    </Form.Item>
                    <Form.Item
                      name="description"
                      label="Description"
                      rules={[
                        {
                          required: true,
                          message: 'Please provide the description of your course.',
                        },
                      ]}
                    >
                      <TextArea />
                    </Form.Item>
                    <Form.Item
                      name="language"
                      label="Language"
                      rules={[
                        { required: true, message: 'Please indicate the language of your course.' },
                      ]}
                    >
                      <Select size="large" />
                    </Form.Item>
                    <Form.Item
                      name="diffculty"
                      label="Level"
                      rules={[
                        {
                          required: true,
                          message: 'Please indicate the level of difficulty of your course.',
                        },
                      ]}
                    >
                      <Select size="large" />
                    </Form.Item>
                    <Form.Item
                      name="category"
                      label="Category"
                      rules={[
                        { required: true, message: 'Please indicate the category of your course.' },
                      ]}
                    >
                      <Select size="large" />
                    </Form.Item>
                    <Form.Item
                      name="courseImage"
                      label="Course Image"
                      rules={[{ required: true, message: 'Please add a course image.' }]}
                    >
                      <Upload>
                        <Button icon={<UploadOutlined />}>Click to Upload</Button>
                      </Upload>
                    </Form.Item>
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

export default SenseiCreateCourse

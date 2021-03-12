import React, { useEffect, useState } from 'react'
import { useHistory, useParams } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { isNil, map } from 'lodash'
import {
  Button,
  Form,
  Input,
  InputNumber,
  notification,
  Popconfirm,
  Select,
  Space,
  Table,
  Tooltip,
} from 'antd'
import {
  ArrowLeftOutlined,
  DeleteOutlined,
  EditOutlined,
  PlusOutlined,
  SaveOutlined,
  UploadOutlined,
} from '@ant-design/icons'
import TextArea from 'antd/lib/input/TextArea'

import { createCourse, getCourseById, updateCourse } from 'services/courses'
import { createLesson } from 'services/courses/lessons'
import { languages, currencyCodes } from 'constants/information'
import { DEFAULT_TIMEOUT, LEVEL_ENUM } from 'constants/constants'

const SenseiCreateCourse = () => {
  const history = useHistory()
  const { id } = useParams()
  const categories = useSelector(state => state.categories)

  const { Option } = Select

  const [lessons, setLessons] = useState([])
  const [isCourseCreated, setIsCourseCreated] = useState(false)
  const [currentCourse, setCurrentCourse] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const [courseForm] = Form.useForm()

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

  const tableColumns = [
    {
      title: 'Title',
      key: 'title',
      dataIndex: 'title',
    },
    {
      title: 'Lesson Text',
      key: 'description',
      dataIndex: 'description',
    },
    {
      title: 'Assessment Video',
      key: 'assessmentUrl',
      dataIndex: 'assessmentUrl',
    },
    {
      title: 'Lesson Video',
      key: 'videoUrl',
      dataIndex: 'videoUrl',
    },
    {
      title: 'Lesson ID',
      key: 'lessonId',
      dataIndex: 'lessonId',
    },
    {
      title: 'Actions',
      key: 'actions',
      render: record => <EditLessonButton record={record} />,
    },
  ]

  const EditLessonButton = data => {
    const { record } = data
    return (
      <Space size="middle">
        <Button
          type="primary"
          size="large"
          shape="circle"
          icon={<EditOutlined />}
          onClick={() => console.log(record)}
        />
        <Button type="danger" size="large" shape="circle" icon={<DeleteOutlined />} />
      </Space>
    )
  }

  const addLesson = async () => {
    if (currentCourse && !isNil(currentCourse.courseId)) {
      const result = await createLesson(currentCourse.courseId)
      if (result && !isNil(result.lesson)) {
        result.lesson.key = result.lesson.lessonId
        setLessons([...lessons, result.lesson])
      }
    }
  }

  const saveCourseDraft = async () => {
    setIsLoading(true)
    const values = courseForm.getFieldsValue()
    const formValues = {
      title: values.title,
      subTitle: values.subTitle,
      description: values.description,
      imgUrl: 'n.a.',
      language: values.language,
      priceAmount: values.priceAmount,
      currency: values.currency,
      level: values.level,
      categories: values.categories,
    }
    const result = !isCourseCreated
      ? await createCourse(formValues)
      : await updateCourse(currentCourse.courseId, formValues)
    if (result && !isNil(result.message)) {
      if (result.course) {
        setCurrentCourse(result.course)
        notification.success({
          message: 'Success',
          description: `Your course draft was successfully ${
            !isCourseCreated ? 'created' : 'updated'
          }.`,
        })
      }
    } else {
      notification.error({ message: 'Error', description: 'There was an error saving your draft.' })
    }
    setIsCourseCreated(true)
    if (!isNil(result.course)) {
      setCourseFormValues(result.course)
    }
    setTimeout(() => {
      setIsLoading(false)
    }, DEFAULT_TIMEOUT)
  }

  const setCourseFormValues = data => {
    courseForm.setFieldsValue({
      title: data.title,
      subTitle: data.subTitle,
      description: data.description,
      imgUrl: data.imgUrl,
      language: data.language,
      priceAmount: data.priceAmount,
      currency: data.currency,
      level: data.level,
      categories: data.Categories.map(c => c.categoryId),
    })
  }

  useEffect(() => {
    if (!isNil(id)) {
      const getCourseToEdit = async () => {
        const result = await getCourseById(id)
        if (result && !isNil(result.course)) {
          setCurrentCourse(result.course)
          setIsCourseCreated(true)

          courseForm.setFieldsValue({
            title: result.course.title,
            subTitle: result.course.subTitle,
            description: result.course.description,
            imgUrl: result.course.imgUrl,
            language: result.course.language,
            priceAmount: result.course.priceAmount,
            currency: result.course.currency,
            level: result.course.level,
            categories: result.course.Categories.map(c => c.categoryId),
          })
        }
        let lessonData = []
        if (!isNil(result.course.Lessons)) {
          lessonData = map(result.course.Lessons, res => ({
            ...res,
            key: res.lessonId,
          }))
          setLessons(lessonData)
        }
      }
      getCourseToEdit()
    }
  }, [courseForm, id])

  return (
    <div>
      <div className="row pt-2">
        <div className="col-12 col-md-3 col-lg-2 mt-4 mt-md-0">
          <Popconfirm
            title="Do you wish to discard your changes?"
            placement="bottom"
            onConfirm={onBack}
            okText="Yes"
            cancelText="No"
          >
            <Button block type="primary" size="large" shape="round" icon={<ArrowLeftOutlined />}>
              Back
            </Button>
          </Popconfirm>
        </div>
      </div>

      <div className="row mt-4">
        <div className="col-12">
          <div className="card">
            <div className="card-header">
              <div className="row align-items-center justify-content-between">
                <div className="col-12 col-md-auto text-center text-md-left">
                  <span className="text-dark text-uppercase h3">
                    <strong>{!isCourseCreated ? 'Create New Course' : 'Edit Course Draft'}</strong>
                  </span>
                </div>
                <div className="col-12 col-md-auto mt-4 mt-md-0 text-center text-md-right">
                  <Space size="large">
                    <Button
                      ghost
                      type="primary"
                      size="large"
                      shape="round"
                      icon={<SaveOutlined />}
                      form="courseForm"
                      htmlType="submit"
                      loading={isLoading}
                    >
                      Save Draft
                    </Button>
                    <Tooltip title="Courses require approval before they can be published to the store.">
                      <Button type="primary" size="large" shape="round" icon={<UploadOutlined />}>
                        Submit
                      </Button>
                    </Tooltip>
                  </Space>
                </div>
              </div>
            </div>
            <div className="card-body">
              <div className="row">
                <div className="col-12">
                  <Form
                    {...formItemLayout}
                    id="courseForm"
                    form={courseForm}
                    layout="vertical"
                    hideRequiredMark
                    onFinish={saveCourseDraft}
                    initialValues={{
                      title: 'Test',
                      subTitle: 'TestSubtitle',
                      description: 'Test',
                    }}
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
                      name="subTitle"
                      label="Subtitle"
                      rules={[
                        {
                          required: true,
                          message: 'Please provide the subtitle of your course.',
                        },
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
                        {
                          required: true,
                          message: 'Please indicate the language of your course.',
                        },
                      ]}
                    >
                      <Select
                        showSearch
                        size="large"
                        filterOption={(input, option) =>
                          option.value.toLowerCase().indexOf(input.toLowerCase()) >= 0
                        }
                      >
                        {map(languages, language => {
                          const { name } = language
                          return (
                            <Option key={name} value={name}>
                              {name}
                            </Option>
                          )
                        })}
                      </Select>
                    </Form.Item>
                    <Form.Item
                      name="level"
                      label="Level"
                      rules={[
                        {
                          required: true,
                          message: 'Please indicate the level of difficulty of your course.',
                        },
                      ]}
                    >
                      <Select
                        showSearch
                        size="large"
                        optionFilterProp="children"
                        filterOption={(input, option) =>
                          option.value.toLowerCase().indexOf(input.toLowerCase()) >= 0
                        }
                      >
                        {map(LEVEL_ENUM, value => {
                          return (
                            <Option key={value} value={value}>
                              {value}
                            </Option>
                          )
                        })}
                      </Select>
                    </Form.Item>
                    <Form.Item
                      name="categories"
                      label="Categories"
                      rules={[
                        {
                          required: true,
                          message: 'Please indicate the category of your course.',
                        },
                      ]}
                    >
                      <Select
                        showSearch
                        mode="multiple"
                        size="large"
                        filterOption={(input, option) => {
                          return option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                        }}
                      >
                        {map(categories, category => {
                          const { categoryId, name } = category
                          return (
                            <Option key={categoryId} value={categoryId}>
                              {name}
                            </Option>
                          )
                        })}
                      </Select>
                    </Form.Item>
                    <Form.Item
                      name="currency"
                      label="Currency"
                      rules={[
                        {
                          required: true,
                          message: 'Please indicate the currency you are selling your course in.',
                        },
                      ]}
                    >
                      <Select
                        showSearch
                        size="large"
                        filterOption={(input, option) => {
                          return option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                        }}
                      >
                        {map(currencyCodes, currency => {
                          const { code, name } = currency
                          return (
                            <Option key={code} value={code}>
                              {`${name} (${code})`}
                            </Option>
                          )
                        })}
                      </Select>
                    </Form.Item>
                    <Form.Item
                      name="priceAmount"
                      label="Price"
                      rules={[
                        { required: true, message: 'Please provide the cost of your course.' },
                      ]}
                    >
                      <InputNumber stringMode size="large" step="0.01" className="w-50" />
                    </Form.Item>
                    <Form.Item name="courseImage" label="Course Image">
                      <Button icon={<UploadOutlined />}>Click to Upload</Button>
                    </Form.Item>
                  </Form>
                </div>
                <div className="col-12 text-right">
                  <Tooltip
                    visible={!isCourseCreated}
                    title="Please save your course as a draft before adding lessons."
                  >
                    <Button
                      disabled={!isCourseCreated}
                      type="primary"
                      size="large"
                      shape="round"
                      icon={<PlusOutlined />}
                      onClick={() => addLesson()}
                    >
                      Add Lesson
                    </Button>
                  </Tooltip>
                </div>
                <div className="col-12 mt-4">
                  <Table bordered className="w-100" columns={tableColumns} dataSource={lessons} />
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

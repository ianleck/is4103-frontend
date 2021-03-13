import React, { useEffect, useState } from 'react'
import { useHistory, useParams } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { isNil, map } from 'lodash'
import {
  Button,
  Form,
  Input,
  InputNumber,
  message,
  Modal,
  notification,
  Popconfirm,
  Select,
  Space,
  Table,
  Tooltip,
  Upload,
} from 'antd'
import {
  ArrowLeftOutlined,
  DeleteOutlined,
  EditOutlined,
  PlusOutlined,
  SaveOutlined,
  UploadOutlined,
} from '@ant-design/icons'

import { createCourse, getCourseById, updateCourse } from 'services/courses'
import { createLesson, deleteLesson, updateLesson } from 'services/courses/lessons'
import { formatTime } from 'components/utils'
import { languages, currencyCodes } from 'constants/information'
import { ADMIN_VERIFIED_ENUM, DEFAULT_TIMEOUT, LEVEL_ENUM } from 'constants/constants'

const SenseiCreateCourse = () => {
  const history = useHistory()
  const { id } = useParams()
  const categories = useSelector(state => state.categories)
  const user = useSelector(state => state.user)

  const { Option } = Select
  const { TextArea } = Input

  const [isLoading, setIsLoading] = useState(false)

  const [lessons, setLessons] = useState([])
  const [isCourseCreated, setIsCourseCreated] = useState(false)
  const [isCourseDraft, setIsCourseDraft] = useState(true)
  const [currentCourse, setCurrentCourse] = useState('')
  const [showEditLesson, setShowEditLesson] = useState(false)
  const [currentLesson, setCurrentLesson] = useState('')

  const [courseForm] = Form.useForm()
  const [editLessonForm] = Form.useForm()

  const onBack = e => {
    e.preventDefault()
    history.goBack()
  }

  const onFinishFailed = errorInfo => {
    console.log('Failed:', errorInfo)
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
      title: 'Actions',
      key: 'actions',
      render: record => <EditLessonButton record={record} />,
    },
  ]

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

  const getUploadProps = uploadType => {
    let uploadUrl = ''
    switch (uploadType) {
      case 'courseImg':
        uploadUrl = `http://localhost:5000/api/upload/course/${id}`
        break
      case 'lessonFile':
        uploadUrl = `http://localhost:5000/api/upload/lesson/file/${currentLesson.lessonId}`
        break
      case 'lessonVideo':
        uploadUrl = `http://localhost:5000/api/upload/lesson/video/${currentLesson.lessonId}`
        break
      case 'assessmentVideo':
        uploadUrl = `http://localhost:5000/api/upload/lesson/assessment/${currentLesson.lessonId}`
        break
      default:
        break
    }

    return {
      name: 'file',
      action: uploadUrl,
      headers: {
        authorization: `Bearer ${user.accessToken}`,
      },
      onChange(info) {
        if (info.file.status !== 'uploading') {
          console.log(info.file, info.fileList)
        }
        if (info.file.status === 'done') {
          message.success(`${info.file.name} file uploaded successfully`)
        } else if (info.file.status === 'error') {
          message.error(`${info.file.name} file upload failed.`)
        }
      },
    }
  }

  const EditLessonButton = data => {
    const { record } = data
    return (
      <Space size="middle">
        <Button
          type="primary"
          size="large"
          shape="circle"
          icon={<EditOutlined />}
          onClick={() => handleEditLesson(record)}
        />
        <Popconfirm
          title="Do you wish to delete this lesson?"
          onConfirm={() => handleDeleteLesson(record)}
          okText="Delete"
          okType="danger"
        >
          <Button type="danger" size="large" shape="circle" icon={<DeleteOutlined />} />
        </Popconfirm>
      </Space>
    )
  }

  const editLessonFormFooter = (
    <div className="row justify-content-between">
      <div className="col-auto">
        <Button type="default" size="large" onClick={() => setShowEditLesson(false)} className="">
          Close
        </Button>
      </div>
      <div className="col-auto">
        <Button type="primary" form="editLessonForm" htmlType="submit" size="large" className="">
          Update
        </Button>
      </div>
    </div>
  )

  const addLesson = async () => {
    if (currentCourse && !isNil(currentCourse.courseId)) {
      const result = await createLesson(currentCourse.courseId)
      if (result && !isNil(result.lesson)) {
        result.lesson.key = result.lesson.lessonId
        setLessons([...lessons, result.lesson])
      }
    }
  }

  const handleEditLesson = record => {
    console.log('record', record)
    setCurrentLesson(record)
    setShowEditLesson(true)
    editLessonForm.setFieldsValue({
      lessonTitle: record.title,
      lessonDescription: record.description,
    })
  }

  const handleDeleteLesson = async record => {
    const result = await deleteLesson(record.lessonId)
    if (result && !isNil(result.success)) {
      if (result.success) {
        getCourseToEdit()
        notification.success({
          message: 'Success',
          description: `Your lesson was successfully deleted.`,
        })
      }
    } else {
      notification.error({
        message: 'Error',
        description: 'There was an error deleting your lesson.',
      })
    }
  }

  const onEditLesson = async values => {
    const formValues = {
      title: values.lessonTitle,
      description: values.lessonDescription,
    }
    const result = await updateLesson(currentLesson.lessonId, formValues)
    if (result && !isNil(result.message)) {
      if (result.lesson) {
        getCourseToEdit()
        notification.success({
          message: 'Success',
          description: `Your lesson was successfully updated.`,
        })
        setShowEditLesson(false)
      }
    } else {
      notification.error({
        message: 'Error',
        description: 'There was an error saving your lesson.',
      })
    }
  }

  const saveCourseDraft = async () => {
    setIsLoading(true)
    const values = courseForm.getFieldsValue()
    const formValues = {
      title: values.title,
      subTitle: values.subTitle,
      description: values.description,
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
          description: `Your course ${isCourseDraft ? 'draft' : ''} was successfully ${
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
      setIsCourseDraft(result.course.adminVerified === ADMIN_VERIFIED_ENUM.DRAFT)
    }
    setTimeout(() => {
      setIsLoading(false)
    }, DEFAULT_TIMEOUT)
  }

  const submitCourseForApproval = async () => {
    setIsLoading(true)
    const formValues = {
      adminVerified: ADMIN_VERIFIED_ENUM.PENDING,
    }
    const result = await updateCourse(currentCourse.courseId, formValues)
    if (result && !isNil(result.message)) {
      if (result.course) {
        setCurrentCourse(result.course)
        notification.success({
          message: 'Success',
          description: `Your course was submitted for approval.`,
        })
      }
    } else {
      notification.error({
        message: 'Error',
        description: 'There was an error submitting your course for approval.',
      })
    }
    setTimeout(() => {
      setIsLoading(false)
    }, DEFAULT_TIMEOUT)
  }

  const getCourseToEdit = async () => {
    const result = await getCourseById(id)
    if (result && !isNil(result.course)) {
      setCurrentCourse(result.course)
      setIsCourseCreated(true)
      setIsCourseDraft(result.course.adminVerified === ADMIN_VERIFIED_ENUM.DRAFT)

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

  useEffect(() => {
    if (!isNil(id)) {
      getCourseToEdit()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

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
                    <strong>
                      {!isCourseCreated
                        ? 'Create New Course'
                        : `Edit Course ${isCourseDraft ? 'Draft' : ''}`}
                    </strong>
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
                      {isCourseDraft ? 'Save Draft' : 'Update Course'}
                    </Button>
                    {(!!isCourseDraft ||
                      currentCourse.adminVerified === ADMIN_VERIFIED_ENUM.REJECTED) && (
                      <Tooltip title="Courses require approval before they can be published to the store.">
                        <Popconfirm
                          title="Do you wish to submit your course for administrator review and approval?"
                          placement="bottom"
                          onConfirm={() => submitCourseForApproval()}
                          okText="Yes"
                          cancelText="No"
                        >
                          <Button
                            disabled={!isCourseCreated}
                            type="primary"
                            size="large"
                            shape="round"
                            icon={<UploadOutlined />}
                          >
                            {isCourseDraft ? 'Submit' : 'Resubmit'}
                          </Button>
                        </Popconfirm>
                      </Tooltip>
                    )}
                  </Space>
                </div>
              </div>
            </div>
            <div className="card-body">
              <div className="row">
                <div className="col-12">
                  <Tooltip title="Please save your course as a draft before adding a course image.">
                    <Upload {...getUploadProps('courseImg')}>
                      <Button disabled={!isCourseCreated} icon={<UploadOutlined />}>
                        Upload Course Image
                      </Button>
                    </Upload>
                  </Tooltip>
                </div>
              </div>
              <div className="row mt-4">
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
                      level: LEVEL_ENUM.BEGINNER,
                      language: 'English',
                      currency: 'SGD',
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
      <Modal
        title="Edit Lesson"
        visible={showEditLesson}
        cancelText="Close"
        centered
        okButtonProps={{ style: { display: 'none' } }}
        onCancel={() => setShowEditLesson(false)}
        footer={editLessonFormFooter}
      >
        <Form
          form={editLessonForm}
          id="editLessonForm"
          layout="vertical"
          hideRequiredMark
          onSubmit={e => e.preventDefault()}
          onFinish={onEditLesson}
          onFinishFailed={onFinishFailed}
        >
          <div className="row">
            <div className="col-12">
              <Form.Item
                name="lessonTitle"
                label="Title"
                rules={[{ required: true, message: 'Please input your lesson title.' }]}
              >
                <Input />
              </Form.Item>
            </div>
            <div className="col-12">
              <Form.Item
                name="lessonDescription"
                label="Description"
                rules={[{ required: true, message: 'Please input your lesson content.' }]}
              >
                <TextArea autoSize={{ minRows: 2, maxRows: 6 }} />
              </Form.Item>
            </div>
          </div>
        </Form>
        <div className="row">
          <div className="col-12 mt-2">
            <Upload {...getUploadProps('lessonVideo')}>
              <Button disabled={!isCourseCreated} icon={<UploadOutlined />}>
                Upload Lesson Video
              </Button>
            </Upload>
          </div>
          <div className="col-12 mt-2">
            <Upload {...getUploadProps('assessmentVideo')}>
              <Button disabled={!isCourseCreated} icon={<UploadOutlined />}>
                Upload Assessment Video
              </Button>
            </Upload>
          </div>
          <div className="col-12 mt-2">
            <Upload {...getUploadProps('lessonFile')}>
              <Button disabled={!isCourseCreated} icon={<UploadOutlined />}>
                Upload Lesson File
              </Button>
            </Upload>
          </div>
        </div>
        <div className="row mt-2">
          <div className="col-12 text-right">
            <small className="text-secondary text-uppercase">
              <strong>CREATED ON </strong>
              {formatTime(currentLesson.created_at)}
            </small>
          </div>
          <div className="col-12 text-right">
            <small className="text-secondary text-uppercase">
              <strong>UPDATED ON </strong>
              {formatTime(currentLesson.updated_at)}
            </small>
          </div>
        </div>
      </Modal>
    </div>
  )
}

export default SenseiCreateCourse

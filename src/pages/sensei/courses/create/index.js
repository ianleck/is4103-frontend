import React, { useEffect, useState } from 'react'
import { useHistory, useParams } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { isEmpty, isNil, map, size } from 'lodash'
import {
  Button,
  Card,
  Empty,
  Form,
  Input,
  InputNumber,
  message,
  Modal,
  notification,
  Popconfirm,
  Radio,
  Select,
  Space,
  Switch,
  Table,
  Tooltip,
  Upload,
} from 'antd'
import {
  ArrowLeftOutlined,
  DeleteOutlined,
  DownloadOutlined,
  EditOutlined,
  PlusOutlined,
  SaveOutlined,
  UploadOutlined,
} from '@ant-design/icons'
import Axios from 'axios'
import download from 'js-file-download'
import ReactPlayer from 'react-player/lazy'
import { createCourse, deleteCourseDraft, getCourseById, updateCourse } from 'services/courses'
import {
  createLesson,
  deleteLesson,
  updateLesson,
  deleteLessonVideo,
  deleteAssessmentVideo,
  deleteLessonFile,
  getCommentsByLessonId,
} from 'services/courses/lessons'
import { formatTime, showNotification } from 'components/utils'
import { languages, currencyCodes } from 'constants/information'
import {
  ADMIN_VERIFIED_ENUM,
  DEFAULT_TIMEOUT,
  LEVEL_ENUM,
  VISIBILITY_ENUM,
} from 'constants/constants'
import {
  ASSESSMENT_VID_DELETE_ERR,
  ASSESSMENT_VID_DELETE_SUCCESS,
  LESSON_DELETE_SUCCESS,
  LESSON_FILE_DELETE_SUCCESS,
  LESSON_FILE_DELETE_ERR,
  LESSON_VID_DELETE_SUCCESS,
  LESSON_VID_DELETE_ERR,
  SUCCESS,
  ERROR,
  LESSON_DELETE_ERR,
  LESSON_UPDATE_SUCCESS,
  LESSON_UPDATE_ERR,
  COURSE_DRAFT_DEL_SUCCESS,
  COURSE_DRAFT_DEL_ERROR,
} from 'constants/notifications'
import StatusTag from 'components/Common/StatusTag'
import CourseAnnouncements from 'components/Sensei/Course/Announcements'
import LessonComments from 'components/Course/LessonComments'

const SenseiCreateCourse = () => {
  const history = useHistory()
  const { id } = useParams()
  const categories = useSelector(state => state.categories)
  const user = useSelector(state => state.user)

  const { Option } = Select
  const { TextArea } = Input

  const [isLoading, setIsLoading] = useState(false)
  const [showDiscardMsg, setShowDiscardMsg] = useState(true)

  const [isCourseCreated, setIsCourseCreated] = useState(false)
  const [isCourseDraft, setIsCourseDraft] = useState(true)
  const [currentCourse, setCurrentCourse] = useState('')
  const [currentCourseTab, setCurrentCourseTab] = useState('settings')
  const [cfmCourseDelete, setCfmCourseDelete] = useState(false)

  const [lessons, setLessons] = useState([])
  const [showEditLesson, setShowEditLesson] = useState(false)
  const [currentLesson, setCurrentLesson] = useState('')
  const [currentLessonTab, setCurrentLessonTab] = useState('lessonVideo')
  const [lessonComments, setLessonComments] = useState([])

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
      lg: { span: 5 },
    },
    wrapperCol: {
      xs: { span: 24 },
      lg: { span: 14 },
    },
  }

  const tableColumns = [
    {
      title: 'Created At',
      key: 'createdAt',
      dataIndex: 'createdAt',
      width: '10%',
      responsive: ['lg'],
      render: record => formatTime(record),
      sorter: (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
      sortDirections: ['ascend', 'descend'],
    },
    {
      title: 'Title',
      key: 'title',
      dataIndex: 'title',
      minWidth: '40%',
      sorter: (a, b) => a.title.length - b.title.length,
      sortDirections: ['ascend', 'descend'],
    },
    {
      title: 'Lesson Text',
      key: 'description',
      dataIndex: 'description',
    },
    {
      title: 'Actions',
      key: 'actions',
      width: '10%',
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
        uploadUrl = `http://localhost:5000/api/upload/course/${
          !isNil(id) ? id : currentCourse.courseId
        }`
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
          getCourseToEdit(currentCourse.courseId)
        } else if (info.file.status === 'error') {
          message.error(`${info.file.name} file upload failed.`)
        }
      },
    }
  }

  const downloadLessonFile = url => {
    Axios.get(url, {
      headers: {
        authorization: `Bearer ${user.accessToken}`,
      },
      responseType: 'blob', // Important
    }).then(resp => {
      download(resp.data, `lessonFile.${url.split('.').pop()}`)
    })
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
          disabled={currentCourse.adminVerified === ADMIN_VERIFIED_ENUM.PENDING}
        />
        <Popconfirm
          title="Do you wish to delete this lesson?"
          onConfirm={() => handleDeleteLesson(record)}
          okText="Delete"
          okType="danger"
        >
          <Button
            type="danger"
            size="large"
            shape="circle"
            icon={<DeleteOutlined />}
            disabled={currentCourse.adminVerified === ADMIN_VERIFIED_ENUM.PENDING}
          />
        </Popconfirm>
      </Space>
    )
  }

  const editLessonFormFooter = (
    <div className="row justify-content-between">
      <div className="col-auto">
        <Button type="default" size="large" onClick={() => setShowEditLesson(false)}>
          Close
        </Button>
      </div>
      <div className="col-auto">
        <Button type="primary" form="editLessonForm" htmlType="submit" size="large">
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
        setLessons([result.lesson, ...lessons])
        setCurrentLesson(result.lesson)
      }
    }
  }

  const getLessonComments = async lessonId => {
    const result = await getCommentsByLessonId(lessonId)
    if (result && !isNil(result.comments)) {
      setLessonComments(result.comments)
    }
  }

  const handleEditLesson = record => {
    setCurrentLesson(record)
    setShowEditLesson(true)
    getLessonComments(record.lessonId)
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
        showNotification('success', SUCCESS, LESSON_DELETE_SUCCESS)
      }
    } else {
      showNotification('error', ERROR, LESSON_DELETE_ERR)
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
        showNotification('success', SUCCESS, LESSON_UPDATE_SUCCESS)
        setShowEditLesson(false)
      }
    } else {
      showNotification('error', ERROR, LESSON_UPDATE_ERR)
    }
  }

  const onCfmCourseDelete = async () => {
    const result = await deleteCourseDraft(currentCourse.courseId, user.accountId)
    if (result && !isNil(result.success)) {
      history.goBack()
      showNotification('success', SUCCESS, COURSE_DRAFT_DEL_SUCCESS)
    } else {
      showNotification('error', ERROR, COURSE_DRAFT_DEL_ERROR)
    }
  }

  const handleDeleteLessonVideo = async () => {
    const result = await deleteLessonVideo(currentLesson.lessonId)

    if (result && !isNil(result.message)) {
      if (result.lesson) {
        getCourseToEdit()
        showNotification('success', SUCCESS, LESSON_VID_DELETE_SUCCESS)
      }
    } else {
      showNotification('error', ERROR, LESSON_VID_DELETE_ERR)
    }
  }

  const handleDeleteAssessmentVideo = async () => {
    const result = await deleteAssessmentVideo(currentLesson.lessonId)

    if (result && !isNil(result.message)) {
      if (result.lesson) {
        getCourseToEdit()
        showNotification('success', SUCCESS, ASSESSMENT_VID_DELETE_SUCCESS)
      }
    } else {
      showNotification('error', ERROR, ASSESSMENT_VID_DELETE_ERR)
    }
  }

  const handleDeleteLessonFile = async () => {
    const result = await deleteLessonFile(currentLesson.lessonId)

    if (result && !isNil(result.message)) {
      if (result.lesson) {
        getCourseToEdit()
        showNotification('success', SUCCESS, LESSON_FILE_DELETE_SUCCESS)
      }
    } else {
      showNotification('error', ERROR, LESSON_FILE_DELETE_ERR)
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
          message: result.message,
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
      setShowDiscardMsg(false)
    }
    setTimeout(() => {
      setIsLoading(false)
    }, DEFAULT_TIMEOUT)
  }

  const removeCourseImg = async () => {
    const formValues = {
      imgUrl: null,
    }
    const result = await updateCourse(currentCourse.courseId, formValues)
    if (result && !isNil(result.message)) {
      if (result.course) {
        setCurrentCourse(result.course)
        notification.success({
          message: result.message,
          description: `Course Image removed.`,
        })
      }
    } else {
      notification.error({
        message: 'Error',
        description: 'There was an error removing your course image.',
      })
    }
  }

  const submitCourseForApproval = async () => {
    const formValues = {
      adminVerified: ADMIN_VERIFIED_ENUM.PENDING,
    }
    const result = await updateCourse(currentCourse.courseId, formValues)
    if (result && !isNil(result.message)) {
      if (result.course) {
        setCurrentCourse(result.course)
        setIsCourseDraft(result.course.adminVerified === ADMIN_VERIFIED_ENUM.DRAFT)
        setShowDiscardMsg(false)
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
  }

  const toggleCourseVisibility = async () => {
    const toggleVisibility =
      currentCourse.visibility === VISIBILITY_ENUM.HIDDEN
        ? VISIBILITY_ENUM.PUBLISHED
        : VISIBILITY_ENUM.HIDDEN
    const formValues = {
      visibility: toggleVisibility,
    }
    const result = await updateCourse(currentCourse.courseId, formValues)
    if (result && !isNil(result.message)) {
      if (result.course) {
        setCurrentCourse(result.course)
        notification.success({
          message: 'Success',
          description: `Your course was ${toggleVisibility.toLowerCase()} successfully.`,
        })
      }
    }
  }

  const getCourseToEdit = async () => {
    const result = await getCourseById(!isNil(id) ? id : currentCourse.courseId)
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
    if (result.course && !isNil(result.course.Lessons)) {
      const lessonData = map(result.course.Lessons, res => ({
        ...res,
        key: res.lessonId,
      }))
      setLessons(
        lessonData.sort(
          (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
        ),
      )
      for (let i = 0; i < size(lessonData); i += 1) {
        if (lessonData[i].key === currentLesson.lessonId) {
          setCurrentLesson(lessonData[i])
          break
        }
      }
    }
  }

  useEffect(() => {
    if (!isNil(id)) {
      getCourseToEdit()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const CourseSettings = () => {
    return (
      <div>
        <div className="row mt-2">
          <div className="col-12 col-xl-5">
            <Card
              title="Course Image"
              actions={[
                <Tooltip title="Please save your course as a draft before adding a course image.">
                  <Upload {...getUploadProps('courseImg')} showUploadList={false}>
                    <Button disabled={!isCourseCreated} icon={<UploadOutlined />}>
                      Upload
                    </Button>
                  </Upload>
                </Tooltip>,
                <Button
                  danger
                  icon={<DeleteOutlined />}
                  disabled={isNil(currentCourse.imgUrl)}
                  onClick={() => removeCourseImg()}
                >
                  Remove
                </Button>,
              ]}
            >
              <div className="row">
                <div className="col-12 text-center">
                  <img
                    className="course-card-img-holder"
                    alt="course"
                    src={
                      !isNil(currentCourse.imgUrl)
                        ? `${currentCourse.imgUrl}?${new Date().getTime()}`
                        : '/resources/images/course-placeholder.png'
                    }
                  />
                </div>
              </div>
            </Card>
          </div>
          <div className="col-12 mt-4">
            <span className="font-weight-bold font-size-18">
              Current Course Status:&nbsp;&nbsp;
            </span>
            <span className="align-middle">
              <StatusTag data={currentCourse} type="ADMIN_VERIFIED_ENUM" />
            </span>
          </div>
          {currentCourse.adminVerified === ADMIN_VERIFIED_ENUM.ACCEPTED && (
            <div className="col-12 mt-4">
              <Switch
                checked={currentCourse.visibility === VISIBILITY_ENUM.PUBLISHED}
                disabled={currentCourse.adminVerified !== ADMIN_VERIFIED_ENUM.ACCEPTED}
                checkedChildren="ON"
                unCheckedChildren="OFF"
                onChange={() => toggleCourseVisibility()}
              />
              <span>&nbsp;&nbsp;Publish Course to Marketplace</span>
            </div>
          )}
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
            >
              <Form.Item
                name="title"
                label="Title"
                rules={[{ required: true, message: 'Please provide the title of your course.' }]}
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
                rules={[{ required: true, message: 'Please provide the cost of your course.' }]}
              >
                <InputNumber
                  formatter={value => `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                  parser={value => value.replace(/\$\s?|(,*)/g, '')}
                  step="0.01"
                  min={0}
                  className="w-50"
                />
              </Form.Item>
            </Form>
          </div>
        </div>
      </div>
    )
  }

  const CourseLessons = () => {
    return (
      <div className="row mt-4">
        <div className="col-12 text-right">
          <Tooltip
            visible={!isCourseCreated}
            title="Please save your course as a draft before adding lessons."
          >
            <Button
              disabled={
                !isCourseCreated || currentCourse.adminVerified === ADMIN_VERIFIED_ENUM.PENDING
              }
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
    )
  }

  return (
    <div>
      <div className="row pt-2">
        <div className="col-12 col-md-3 col-lg-2 mt-4 mt-md-0">
          {showDiscardMsg && (
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
          )}
          {!showDiscardMsg && (
            <Button
              block
              type="primary"
              size="large"
              shape="round"
              icon={<ArrowLeftOutlined />}
              onClick={onBack}
            >
              Back
            </Button>
          )}
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
                      disabled={currentCourse.adminVerified === ADMIN_VERIFIED_ENUM.PENDING}
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
              <div className="row align-items-center mt-4">
                <div className="col-12 text-center text-md-left">
                  <Radio.Group defaultValue="settings" size="large">
                    <Radio.Button value="settings" onClick={() => setCurrentCourseTab('settings')}>
                      Settings
                    </Radio.Button>
                    <Radio.Button
                      value="lessons"
                      disabled={!isCourseCreated}
                      onClick={() => setCurrentCourseTab('lessons')}
                    >
                      Lessons
                    </Radio.Button>
                    <Radio.Button
                      value="announcements"
                      disabled={!isCourseCreated}
                      onClick={() => setCurrentCourseTab('announcements')}
                    >
                      Announcements
                    </Radio.Button>
                  </Radio.Group>
                </div>
              </div>
            </div>
            <div className="card-body">
              {currentCourseTab === 'settings' && <CourseSettings />}
              {currentCourseTab === 'lessons' && <CourseLessons />}
              {currentCourseTab === 'announcements' && (
                <CourseAnnouncements
                  currentCourse={currentCourse}
                  isCourseCreated={isCourseCreated}
                />
              )}
            </div>
            {!isEmpty(currentCourse) && isNil(currentCourse.publishedAt) && (
              <div className="card-footer">
                <Popconfirm
                  title="Do you wish to delete your course?"
                  visible={cfmCourseDelete}
                  onConfirm={onCfmCourseDelete}
                  okText="Delete"
                  okType="danger"
                  okButtonProps={{ loading: isLoading }}
                  onCancel={() => setCfmCourseDelete(false)}
                >
                  <Button
                    type="danger"
                    size="large"
                    shape="round"
                    icon={<DeleteOutlined />}
                    onClick={() => setCfmCourseDelete(true)}
                  >
                    Delete Course
                  </Button>
                </Popconfirm>
              </div>
            )}
          </div>
        </div>
      </div>
      <Modal
        title="Edit Lesson"
        className="w-100"
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
          <div className="col-12">
            <Radio.Group defaultValue="lessonVideo" size="large">
              <Radio.Button value="lessonVideo" onClick={() => setCurrentLessonTab('lessonVideo')}>
                Lesson Video
              </Radio.Button>
              <Radio.Button
                value="assessmentVideo"
                onClick={() => setCurrentLessonTab('assessmentVideo')}
              >
                Assessment Video
              </Radio.Button>
              <Radio.Button value="lessonFile" onClick={() => setCurrentLessonTab('lessonFile')}>
                Lesson File
              </Radio.Button>
              <Radio.Button
                value="lessonComments"
                onClick={() => setCurrentLessonTab('lessonComments')}
              >
                Comments
              </Radio.Button>
            </Radio.Group>
          </div>
          {currentLessonTab === 'lessonVideo' && (
            <div className="col-12">
              {!isNil(currentLesson.videoUrl) && (
                <div className="mt-4">
                  <ReactPlayer controls width="100%" url={currentLesson.videoUrl} />
                </div>
              )}
              {isNil(currentLesson.videoUrl) && <Empty className="mt-4" />}
              <div className="mt-4">
                <Space size="large">
                  <Upload {...getUploadProps('lessonVideo')} showUploadList={false}>
                    <Button disabled={!isCourseCreated} icon={<UploadOutlined />}>
                      Upload Lesson Video
                    </Button>
                  </Upload>
                  {!isNil(currentLesson.videoUrl) && (
                    <Button
                      danger
                      icon={<DeleteOutlined />}
                      onClick={() => handleDeleteLessonVideo()}
                    >
                      Delete Video
                    </Button>
                  )}
                </Space>
              </div>
            </div>
          )}
          {currentLessonTab === 'assessmentVideo' && (
            <div className="col-12">
              {!isNil(currentLesson.assessmentUrl) && (
                <div className="mt-4">
                  <ReactPlayer controls width="100%" url={currentLesson.assessmentUrl} />
                </div>
              )}
              {isNil(currentLesson.assessmentUrl) && <Empty className="mt-4" />}
              <div className="mt-4">
                <Space>
                  <Upload {...getUploadProps('assessmentVideo')} showUploadList={false}>
                    <Button disabled={!isCourseCreated} icon={<UploadOutlined />}>
                      Upload Assessment Video
                    </Button>
                  </Upload>
                  {!isNil(currentLesson.assessmentUrl) && (
                    <Button
                      danger
                      icon={<DeleteOutlined />}
                      onClick={() => handleDeleteAssessmentVideo()}
                    >
                      Delete Video
                    </Button>
                  )}
                </Space>
              </div>
            </div>
          )}
          {currentLessonTab === 'lessonFile' && (
            <div className="col-12">
              {!isNil(currentLesson.lessonFileUrl) && (
                <div className="mt-4">
                  <Button
                    type="primary"
                    icon={<DownloadOutlined />}
                    onClick={() => downloadLessonFile(currentLesson.lessonFileUrl)}
                  >
                    Download
                  </Button>
                </div>
              )}
              {isNil(currentLesson.lessonFileUrl) && <Empty className="mt-4" />}
              <div className="mt-4">
                <Space>
                  <Upload {...getUploadProps('lessonFile')} showUploadList={false}>
                    <Button disabled={!isCourseCreated} icon={<UploadOutlined />}>
                      Upload Lesson File
                    </Button>
                  </Upload>
                  {!isNil(currentLesson.lessonFileUrl) && (
                    <Button
                      danger
                      icon={<DeleteOutlined />}
                      onClick={() => handleDeleteLessonFile()}
                    >
                      Delete Files
                    </Button>
                  )}
                </Space>
              </div>
            </div>
          )}
          {currentLessonTab === 'lessonComments' && (
            <div className="col-12 mt-5">
              <LessonComments
                comments={lessonComments}
                setComments={setLessonComments}
                lessonId={currentLesson.lessonId}
                currentLesson={currentLesson}
              />
            </div>
          )}
        </div>
        <div className="row">
          <div className="col-12 text-right">
            <small className="text-secondary text-uppercase">
              <strong>CREATED ON </strong>
              {formatTime(currentLesson.createdAt)}
            </small>
          </div>
          <div className="col-12 text-right">
            <small className="text-secondary text-uppercase">
              <strong>UPDATED ON </strong>
              {formatTime(currentLesson.updatedAt)}
            </small>
          </div>
        </div>
      </Modal>
    </div>
  )
}

export default SenseiCreateCourse

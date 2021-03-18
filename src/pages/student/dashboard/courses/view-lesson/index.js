import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { useHistory, useParams } from 'react-router-dom'
import {
  Avatar,
  Button,
  Divider,
  Empty,
  Input,
  List,
  Modal,
  Progress,
  Space,
  Typography,
} from 'antd'
import BackBtn from 'components/Common/BackBtn'
import {
  ABOUT_THE_COURSE,
  ADD_COMMENTS,
  CLOSE,
  COURSE_DESC,
  COURSE_PROGRESS,
  DOWNLOAD_LESSON_FILES,
  EMPTY_LESSON_TITLE,
  LESSON_GUIDE,
  LESSON_LIST,
  SHOW_ASSESSMENT_VID,
  SHOW_LESSON_VID,
} from 'constants/text'
import ReactPlayer from 'react-player'
import {
  ArrowLeftOutlined,
  ArrowRightOutlined,
  BookOutlined,
  ContainerOutlined,
  DownloadOutlined,
} from '@ant-design/icons'
import { indexOf, isEmpty, isNil, map, size } from 'lodash'
import { getCourseById } from 'services/courses'
import { showNotification } from 'components/utils'
import {
  ERROR,
  LESSON_FILE_DOWNLOAD_ERR,
  ASSESSMENT_VID_ALR_PLAYING,
  LESSON_VID_ALR_PLAYING,
} from 'constants/notifications'
import Axios from 'axios'
import download from 'js-file-download'

const StudentCourseLesson = () => {
  const { courseId, lessonId } = useParams()

  const [currentCourse, setCurrentCourse] = useState('')
  const [currentLesson, setCurrentLesson] = useState('')
  const [currentVideoUrl, setCurrentVideoUrl] = useState('')

  useEffect(() => {
    const viewCourse = async () => {
      const result = await getCourseById(courseId)
      if (result && !isNil(result.course)) {
        setCurrentCourse(result.course)
        if (!isNil(result.course.Lessons)) {
          const viewLesson = result.course.Lessons.filter(o => o.lessonId === lessonId)
          if (size(viewLesson) > 0) {
            setCurrentLesson(viewLesson[0])
            if (!isNil(viewLesson[0].videoUrl)) {
              setCurrentVideoUrl(viewLesson[0].videoUrl)
            }
          }
        }
      }
    }
    viewCourse()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const LessonComments = () => {
    const user = useSelector(state => state.user)
    const [showCommentField, setShowCommentField] = useState(false)

    const { TextArea } = Input

    const ToggleCommentField = () => {
      return (
        <div
          role="button"
          className="col btn border-0 text-left"
          tabIndex={0}
          onClick={() => setShowCommentField(true)}
          onKeyDown={event => event.preventDefault()}
        >
          <span className="text-secondary">{ADD_COMMENTS}</span>
          <Divider className="m-0" />
        </div>
      )
    }

    const AddCommentField = () => {
      return (
        <div>
          <div className="row">
            <div className="col">
              <TextArea autoSize size="large" placeholder={ADD_COMMENTS} />
            </div>
          </div>
          <div className="row mt-3">
            <div className="col-12 text-right">
              <Space>
                <Button ghost type="primary" onClick={() => setShowCommentField(false)}>
                  Cancel
                </Button>
                <Button type="primary">Comment</Button>
              </Space>
            </div>
          </div>
        </div>
      )
    }

    return (
      <div className="row">
        <div className="col-auto">
          <Avatar
            src={
              user.profileImgUrl
                ? `${user.profileImgUrl}?${new Date().getTime()}`
                : '/resources/images/avatars/apprentice.png'
            }
          />
        </div>
        <div className="col pl-0">
          {!showCommentField && <ToggleCommentField />}
          {showCommentField && <AddCommentField />}
        </div>
        <div className="col-12 p-0 mt-4">
          <span>Comments</span>
        </div>
      </div>
    )
  }

  const LessonMainContent = () => {
    const [showLessonGuide, setShowLessonGuide] = useState(false)

    return (
      <div className="card">
        <div className="card-header">
          <div className="row align-items-center justify-content-between">
            <div className="col-12 col-md-8">
              <h3>{currentCourse.title}</h3>
              <h5>{currentLesson.title}</h5>
            </div>
            <div className="col-12 col-md-4 text-center text-md-right">
              <Button type="primary" size="large" onClick={() => setShowLessonGuide(true)}>
                {LESSON_GUIDE}
              </Button>
            </div>
          </div>
        </div>
        <div className="card-body">
          {!isEmpty(currentVideoUrl) ? (
            <ReactPlayer controls width="100%" url={currentVideoUrl} />
          ) : (
            <Empty />
          )}
        </div>
        <Modal
          centered
          title={LESSON_GUIDE}
          visible={showLessonGuide}
          cancelText={CLOSE}
          onCancel={() => setShowLessonGuide(false)}
          okButtonProps={{ style: { display: 'none' } }}
        >
          <div className="row">
            <div className="col-12">
              <h3>{currentLesson.title}</h3>
              <h5 className="mt-2">{currentLesson.description}</h5>
              <hr className="mt-5" />
              <h4 className="text-uppercase font-weight-bold">{ABOUT_THE_COURSE}</h4>
              <h6 className="mt-2">{currentCourse.title}</h6>
              <h6>{currentCourse.subTitle}</h6>
              <h6 className="mt-4 font-weight-bold">{COURSE_DESC}</h6>
              <span className="mt-2 text-dark">{currentCourse.description}</span>
            </div>
          </div>
        </Modal>
      </div>
    )
  }

  const CourseProgressCard = () => {
    return (
      <div className="card">
        <div className="card-body">
          <h5>{COURSE_PROGRESS}</h5>
          <Progress percent={50} status="active" />
        </div>
      </div>
    )
  }

  const AdditionalContentCard = () => {
    const user = useSelector(state => state.user)

    const downloadFiles = () => {
      if (isNil(currentLesson.lessonFileUrl)) {
        showNotification('error', ERROR, LESSON_FILE_DOWNLOAD_ERR)
        return
      }
      Axios.get(currentLesson.lessonFileUrl, {
        headers: {
          authorization: `Bearer ${user.accessToken}`,
        },
        responseType: 'blob', // Important
      }).then(resp => {
        download(resp.data, `lessonfiles.${currentLesson.lessonFileUrl.split('.').pop()}`)
      })
    }

    const toggleAssessmentVideo = toggle => {
      if (toggle === 'lesson' && currentVideoUrl === currentLesson.videoUrl)
        showNotification('success', LESSON_VID_ALR_PLAYING)
      if (toggle === 'assessment' && currentVideoUrl === currentLesson.assessmentUrl)
        showNotification('success', ASSESSMENT_VID_ALR_PLAYING)
      if (toggle === 'assessment') {
        setCurrentVideoUrl(currentLesson.assessmentUrl)
      } else {
        setCurrentVideoUrl(currentLesson.videoUrl)
      }
    }

    return (
      <div className="card">
        <div className="card-body">
          <div className="row">
            <div className="col-12">
              <Button
                type="link"
                size="large"
                icon={<BookOutlined />}
                className="pl-0"
                disabled={isNil(currentLesson.assessmentUrl)}
                onClick={() => toggleAssessmentVideo('assessment')}
              >
                &nbsp;&nbsp;{SHOW_ASSESSMENT_VID}
              </Button>
              <Button
                type="link"
                size="large"
                icon={<ContainerOutlined />}
                className="pl-0"
                disabled={isNil(currentLesson.videoUrl)}
                onClick={() => toggleAssessmentVideo('lesson')}
              >
                &nbsp;&nbsp;{SHOW_LESSON_VID}
              </Button>
            </div>
            <div className="col-12">
              <Button
                type="link"
                size="large"
                icon={<DownloadOutlined />}
                className="pl-0"
                disabled={isNil(currentLesson.lessonFileUrl)}
                onClick={() => downloadFiles()}
              >
                &nbsp;&nbsp;{DOWNLOAD_LESSON_FILES}
              </Button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  const LessonList = () => {
    const history = useHistory()
    let sortedLessonList = []
    let prevLessonId
    let nextLessonId

    const sendToLessonUrl = (sendToCourseId, sendToLessonId) => {
      history.replace(`/student/dashboard/courses/${sendToCourseId}/view-lesson/${sendToLessonId}`)
    }

    if (!isNil(currentCourse.Lessons)) {
      sortedLessonList = currentCourse.Lessons.sort(
        (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
      )
      const currentLessonIdx = indexOf(sortedLessonList, currentLesson)
      if (!isNil(sortedLessonList) && currentLessonIdx !== -1) {
        if (currentLessonIdx + 1 <= size(sortedLessonList) - 1)
          nextLessonId = sortedLessonList[currentLessonIdx + 1].lessonId
        if (currentLessonIdx - 1 >= 0)
          prevLessonId = sortedLessonList[currentLessonIdx - 1].lessonId
      }
    }

    return (
      <div className="card text-dark">
        <div className="card-header">
          <div className="row align-items-center justify-content-between">
            <div className="col-auto">
              <h5 className="mb-0" style={{ lineHeight: 'normal' }}>
                {LESSON_LIST}
              </h5>
            </div>
            <div className="col text-right">
              <Space>
                <Button
                  type="default"
                  size="large"
                  disabled={isNil(prevLessonId)}
                  icon={<ArrowLeftOutlined />}
                  onClick={() => sendToLessonUrl(currentCourse.courseId, prevLessonId)}
                />
                <Button
                  type="default"
                  size="large"
                  disabled={isNil(nextLessonId)}
                  icon={<ArrowRightOutlined />}
                  onClick={() => sendToLessonUrl(currentCourse.courseId, nextLessonId)}
                />
              </Space>
            </div>
          </div>
        </div>
        <div className="card-body lesson-list-card overflow-y-scroll pt-1">
          <div className="row">
            <div className="col-12">
              <List
                itemLayout="horizontal"
                dataSource={map(currentCourse.Lessons, lesson => ({
                  ...lesson,
                  listNumber: indexOf(sortedLessonList, lesson),
                }))}
                renderItem={item => (
                  <List.Item>
                    <Typography.Text
                      className="btn btn-link no-border text-left"
                      onClick={() => sendToLessonUrl(currentCourse.courseId, item.lessonId)}
                    >
                      Lesson {item.listNumber}:{' '}
                      {!isEmpty(item.title) ? item.title : EMPTY_LESSON_TITLE}
                    </Typography.Text>
                  </List.Item>
                )}
              />
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div>
      <div className="row pt-2">
        <div className="col-12 col-md-3 col-lg-2 mt-4 mt-md-0">
          <BackBtn />
        </div>
      </div>
      <div className="row mt-5">
        <div className="col-12 col-lg-8">
          <LessonMainContent />
          <LessonComments />
        </div>
        <div className="col-12 col-lg-4">
          <CourseProgressCard />
          <AdditionalContentCard />
          <LessonList />
        </div>
      </div>
    </div>
  )
}

export default StudentCourseLesson

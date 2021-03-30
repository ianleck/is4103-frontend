import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import BackBtn from 'components/Common/BackBtn'
import { isNil, size } from 'lodash'
import { getCourseById } from 'services/courses'
import { getCommentsByLessonId } from 'services/courses/lessons'
import LessonComments from 'components/Course/LessonComments'
import LessonMainContent from 'components/Course/LessonMainContent'
import CourseProgressCard from 'components/Course/ProgressCard'
import AdditionalContentCard from 'components/Course/AdditionalContentCard'
import LessonPlaylist from 'components/Course/LessonPlaylist'
import { Button, Space } from 'antd'
import { CheckOutlined, CloseOutlined } from '@ant-design/icons'
import { acceptCourseRequest, rejectCourseRequest } from 'services/courses/requests'
import { showNotification } from 'components/utils'
import {
  COURSE_ACCEPT_ERROR,
  COURSE_ACCEPT_SUCCESS,
  COURSE_REJECT_ERROR,
  COURSE_REJECT_SUCCESS,
  ERROR,
  SUCCESS,
} from 'constants/notifications'
import { APPROVE_COURSE, REJECT_COURSE } from 'constants/text'
import { ADMIN_VERIFIED_ENUM } from 'constants/constants'

const AdminCourseLesson = () => {
  const { courseId, lessonId } = useParams()

  const [currentCourse, setCurrentCourse] = useState('')
  const [currentLesson, setCurrentLesson] = useState('')
  const [currentVideoUrl, setCurrentVideoUrl] = useState('')
  const [comments, setComments] = useState([])

  const approveCourse = async () => {
    const result = await acceptCourseRequest(courseId)
    if (result && result.success) {
      viewCourse()
      showNotification('success', SUCCESS, COURSE_ACCEPT_SUCCESS)
    } else {
      showNotification('error', ERROR, COURSE_ACCEPT_ERROR)
    }
  }

  const rejectCourse = async () => {
    const result = await rejectCourseRequest(courseId)
    if (result && result.success) {
      viewCourse()
      showNotification('success', SUCCESS, COURSE_REJECT_SUCCESS)
    } else {
      showNotification('error', ERROR, COURSE_REJECT_ERROR)
    }
  }

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

  const getLessonComments = async () => {
    const result = await getCommentsByLessonId(lessonId)
    if (result && !isNil(result.comments)) {
      setComments(result.comments)
    }
  }

  useEffect(() => {
    viewCourse()
    getLessonComments()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div>
      <div className="row pt-2 justify-content-md-between">
        <div className="col-12 col-md-3 col-lg-2 mt-4 mt-md-0">
          <BackBtn />
        </div>
        <div className="col-12 col-md-auto col-lg-auto mt-4 mt-md-0 text-center text-md-right">
          <Space size="large">
            <Button
              className="btn btn-success text-white"
              shape="round"
              size="large"
              icon={<CheckOutlined />}
              disabled={currentCourse.adminVerified === ADMIN_VERIFIED_ENUM.ACCEPTED}
              onClick={() => approveCourse()}
            >
              {APPROVE_COURSE}
            </Button>
            <Button
              className="btn btn-danger text-white"
              shape="round"
              size="large"
              icon={<CloseOutlined />}
              disabled={currentCourse.adminVerified === ADMIN_VERIFIED_ENUM.REJECTED}
              onClick={() => rejectCourse()}
            >
              {REJECT_COURSE}
            </Button>
          </Space>
        </div>
      </div>
      <div className="row mt-5">
        <div className="col-12 col-lg-8">
          <LessonMainContent
            currentCourse={currentCourse}
            currentLesson={currentLesson}
            currentVideoUrl={currentVideoUrl}
          />
          <LessonComments
            comments={comments}
            setComments={setComments}
            lessonId={lessonId}
            currentLesson={currentLesson}
            isAdmin
          />
        </div>
        <div className="col-12 col-lg-4">
          <CourseProgressCard />
          <AdditionalContentCard
            currentLesson={currentLesson}
            currentVideoUrl={currentVideoUrl}
            setCurrentVideoUrl={setCurrentVideoUrl}
          />
          <LessonPlaylist currentCourse={currentCourse} currentLesson={currentLesson} isAdmin />
        </div>
      </div>
    </div>
  )
}

export default AdminCourseLesson

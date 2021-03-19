import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { Button, Space } from 'antd'
import { CheckOutlined, CloseOutlined } from '@ant-design/icons'
import { isNil } from 'lodash'
import { getAnnouncements, getCourseById } from 'services/courses'
import { LESSONS, COURSE_DESC, APPROVE_COURSE, REJECT_COURSE } from 'constants/text'
import BackBtn from 'components/Common/BackBtn'
import CourseAnnouncementList from 'components/Course/AnnouncementList'
import CourseLessonsList from 'components/Course/LessonsList'
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

const AdminCourseDetails = () => {
  const { id } = useParams()

  const [course, setCourse] = useState([])
  const [announcements, setAnnouncements] = useState([])

  const approveCourse = async () => {
    const result = await acceptCourseRequest(id)
    if (result && result.success) {
      showNotification('success', SUCCESS, COURSE_ACCEPT_SUCCESS)
    } else {
      showNotification('error', ERROR, COURSE_ACCEPT_ERROR)
    }
  }

  const rejectCourse = async () => {
    const result = await rejectCourseRequest(id)
    if (result && result.success) {
      showNotification('success', SUCCESS, COURSE_REJECT_SUCCESS)
    } else {
      showNotification('error', ERROR, COURSE_REJECT_ERROR)
    }
  }

  const getCourseDetails = async () => {
    const courseDetails = await getCourseById(id)
    if (courseDetails && !isNil(courseDetails.course)) {
      setCourse(courseDetails.course)
    }
    const courseAnnouncements = await getAnnouncements(id)
    if (courseAnnouncements && courseAnnouncements.announcements) {
      setAnnouncements(courseAnnouncements.announcements)
    }
  }

  useEffect(() => {
    getCourseDetails()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div>
      <div className="row pt-2 justify-content-center justify-content-md-between">
        <div className="col-12 col-md-3 col-lg-2 mt-4 mt-md-0">
          <BackBtn />
        </div>
        <div className="col-12 col-md-auto col-lg-auto mt-4 mt-md-0 text-center text-md-right">
          <Space size="large">
            <Button
              className="bg-success text-white"
              shape="round"
              size="large"
              icon={<CheckOutlined />}
              onClick={() => approveCourse()}
            >
              {APPROVE_COURSE}
            </Button>
            <Button
              className="bg-danger text-white"
              shape="round"
              size="large"
              icon={<CloseOutlined />}
              onClick={() => rejectCourse()}
            >
              {REJECT_COURSE}
            </Button>
          </Space>
        </div>
      </div>
      <div className="row mt-5">
        <div className="col-12">
          <div className="course-img-banner-holder overflow-scroll">
            <img
              className="course-img-banner"
              alt="example"
              src={
                !isNil(course.imgUrl) ? course.imgUrl : '/resources/images/course-placeholder.png'
              }
            />
          </div>
        </div>
        <div className="col-12 mt-5">
          <div className="text-dark h3">
            <strong>{course.title}</strong>
          </div>
        </div>
      </div>
      <div className="row">
        <div className="col-12">
          <span>{course.subTitle}</span>
        </div>
      </div>
      <div className="row mt-2">
        <div className="col-auto">
          <span>
            by&nbsp;
            <strong>
              {course.Sensei?.firstName} {course.Sensei?.lastName}
            </strong>
          </span>
        </div>
      </div>
      <div className="row mt-4">
        <div className="col-12">
          <div className="card">
            <div className="card-header">
              <div className="text-dark h5 text-uppercase m-0">
                <strong>{COURSE_DESC}</strong>
              </div>
            </div>
            <div className="card-body">{course.description}</div>
          </div>
        </div>
        <div className="col-12">
          <CourseAnnouncementList announcements={announcements} />
        </div>
      </div>
      <div className="row mt-4">
        <div className="col-auto">
          <div className="text-dark h3">
            <strong>{LESSONS}</strong>
          </div>
        </div>
      </div>
      <div className="row mt-4 pb-5">
        <div className="col-12">
          <CourseLessonsList course={course} isAdmin />
        </div>
      </div>
    </div>
  )
}

export default AdminCourseDetails

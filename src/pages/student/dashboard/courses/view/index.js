import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { isNil } from 'lodash'
import { getAnnouncements, getCourseById } from 'services/courses'
import { LESSONS, COURSE_DESC } from 'constants/text'
import BackBtn from 'components/Common/BackBtn'
import CourseAnnouncementList from 'components/Course/AnnouncementList'
import CourseLessonsList from 'components/Course/LessonsList'
import { Button } from 'antd'
import { EditOutlined } from '@ant-design/icons'
import ReviewModal from 'components/Review/ReviewModal'

const StudentCourseDetails = () => {
  const { id } = useParams()

  const [course, setCourse] = useState([])
  const [announcements, setAnnouncements] = useState([])
  const [reviews, setReviews] = useState([])
  const [showReviewModal, setShowReviewModal] = useState(false)

  console.log('reviews', reviews)
  const getCourseDetails = async () => {
    const courseDetails = await getCourseById(id)
    console.log('courseDetails are ', JSON.stringify(courseDetails, null, 2))
    if (courseDetails && !isNil(courseDetails.course)) {
      setCourse(courseDetails.course)
      setReviews([]) // to change
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
      <div className="row pt-2 justify-content-between">
        <div className="col-12 col-md-3 col-lg-2 mt-4 mt-md-0">
          <BackBtn />
        </div>
        <div className="col-auto d-flex justify-content-center mt-4 mt-md-0">
          <Button
            type="primary"
            size="large"
            shape="round"
            onClick={() => {
              setShowReviewModal(true)
            }}
            icon={<EditOutlined />}
          >
            Add a Review
          </Button>
          <ReviewModal
            isVisible={showReviewModal}
            setShowReviewModal={setShowReviewModal}
            isCourse
          />
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
          <CourseLessonsList course={course} />
        </div>
      </div>
    </div>
  )
}

export default StudentCourseDetails

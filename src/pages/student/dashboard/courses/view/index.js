import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { filter, isEmpty, isNil } from 'lodash'
import { getAnnouncements, getCourseById } from 'services/courses'
import { LESSONS, COURSE_DESC } from 'constants/text'
import BackBtn from 'components/Common/BackBtn'
import CourseAnnouncementList from 'components/Course/AnnouncementList'
import CourseLessonsList from 'components/Course/LessonsList'
import { Button, Space } from 'antd'
import { EditOutlined } from '@ant-design/icons'
import ReviewModal from 'components/Review/ReviewModal'
import { useSelector } from 'react-redux'
import { addCourseReview, editCourseReview } from 'services/review'
import {
  ERROR,
  REVIEW_ADD_ERR,
  REVIEW_ADD_SUCCESS,
  REVIEW_EDIT_ERR,
  REVIEW_EDIT_SUCCESS,
  SUCCESS,
} from 'constants/notifications'
import { getUserFirstName, showNotification } from 'components/utils'
import ShareBtn from 'components/Common/Social/ShareBtn'
import { FRONTEND_API } from 'constants/constants'

const StudentCourseDetails = () => {
  const { id } = useParams()
  const user = useSelector(state => state.user)
  const [course, setCourse] = useState([])
  const [announcements, setAnnouncements] = useState([])
  const [reviews, setReviews] = useState([])
  const [ownReview, setOwnReview] = useState([])
  const [showReviewModal, setShowReviewModal] = useState(false)
  const [editMode, setEditMode] = useState(false)

  console.log('reviews', reviews) // this is needed as a placeholder, Nat will deal with reviews in a later PR

  const getCourseDetails = async () => {
    const courseDetails = await getCourseById(id)
    if (courseDetails) {
      if (!isNil(courseDetails.course)) {
        setCourse(courseDetails.course)
        if (!isNil(courseDetails.course.Reviews)) {
          setReviews(courseDetails.course.Reviews)
          const reviewByUser = filter(courseDetails.course.Reviews, review => {
            return review.accountId === user.accountId
          })
          setOwnReview(reviewByUser)
          if (!isEmpty(reviewByUser)) {
            setEditMode(true)
          }
        }
      }
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

  const onSubmitReview = async values => {
    const formValues = {
      rating: values.rating,
      comment: values.comment,
    }

    const payload = { courseId: id, review: { ...formValues } }

    if (editMode) {
      const editResponse = await editCourseReview(payload)

      if (editResponse && !isNil(editResponse.review)) {
        showNotification('success', SUCCESS, REVIEW_EDIT_SUCCESS)
      } else {
        showNotification('error', ERROR, REVIEW_EDIT_ERR)
      }
    } else {
      const addResponse = await addCourseReview(payload)

      if (addResponse && !isNil(addResponse.review)) {
        showNotification('success', SUCCESS, REVIEW_ADD_SUCCESS)
      } else {
        showNotification('error', ERROR, REVIEW_ADD_ERR)
      }
    }

    getCourseDetails()
    setShowReviewModal(false)
  }
  return (
    <div>
      <div className="row pt-2 justify-content-between">
        <div className="col-12 col-md-3 col-lg-2 mt-4 mt-md-0">
          <BackBtn />
        </div>
      </div>
      <div className="row mt-5 justfy-content-between">
        <div className="col-12">
          <div className="course-img-banner-holder">
            <img
              className="course-img-banner"
              alt="example"
              src={
                !isNil(course.imgUrl) ? course.imgUrl : '/resources/images/course-placeholder.png'
              }
            />
          </div>
        </div>
      </div>
      <div className="row mt-5 align-items-center">
        <div className="col-12 col-lg-8 mt-4 mt-lg-0 order-12 order-lg-1">
          <div className="text-dark h3">
            <strong>{course.title}</strong>
          </div>
        </div>
        <div className="col-12 col-lg text-center text-lg-right order-1 order-lg-12">
          <Space size="large">
            <Button
              type="primary"
              size="large"
              shape="round"
              onClick={() => {
                setShowReviewModal(true)
              }}
              icon={<EditOutlined />}
            >
              {`${editMode ? 'Edit your' : 'Add a'}  Review`}
            </Button>
            <ShareBtn
              quote={`${getUserFirstName(user)} is sharing this course: [${
                course.title
              }] with you!`}
              url={`${FRONTEND_API}/courses/${course.courseId}`}
              btnShape="round"
              btnSize="large"
            />
          </Space>
          <ReviewModal
            isVisible={showReviewModal}
            setShowReviewModal={setShowReviewModal}
            review={ownReview}
            onSubmitReview={onSubmitReview}
            editMode={editMode}
          />
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

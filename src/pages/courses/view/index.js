import React, { useEffect, useRef, useState } from 'react'
import { useHistory, useParams } from 'react-router-dom'
import { filter, isEmpty, isNil } from 'lodash'
import { getAnnouncements, getCourseById, getPurchasedCourses } from 'services/courses'
import { LESSONS, APPROVE_COURSE, REJECT_COURSE, COURSE_DESC } from 'constants/text'
import BackBtn from 'components/Common/BackBtn'
import CourseAnnouncementList from 'components/Course/AnnouncementList'
import CourseLessonsList from 'components/Course/LessonsList'
import { Button, Modal, Form, Input, Space, Rate } from 'antd'
import {
  ArrowDownOutlined,
  CheckOutlined,
  CloseOutlined,
  DollarCircleOutlined,
  EditOutlined,
} from '@ant-design/icons'
import ReviewModal from 'components/Common/Reviews/ReviewModal'
import { useSelector } from 'react-redux'
import { addCourseReview, editCourseReview } from 'services/review'
import {
  ERROR,
  REVIEW_ADD_ERR,
  REVIEW_ADD_SUCCESS,
  REVIEW_EDIT_ERR,
  REVIEW_EDIT_SUCCESS,
  SUCCESS,
  COURSE_REFUND_REQUESTED,
  COURSE_ACCEPT_SUCCESS,
  COURSE_ACCEPT_ERROR,
  COURSE_REJECT_SUCCESS,
  COURSE_REJECT_ERROR,
} from 'constants/notifications'
import {
  formatTime,
  getUserFirstName,
  initPageItems,
  onFinishFailed,
  showNotification,
} from 'components/utils'
import ShareBtn from 'components/Common/Social/ShareBtn'
import {
  FRONTEND_API,
  CONTRACT_TYPES,
  USER_TYPE_ENUM,
  ADMIN_VERIFIED_ENUM,
} from 'constants/constants'
import { requestRefund } from 'services/wallet'
import PageHeader from 'components/Common/PageHeader'
import CourseActions from 'components/Common/CourseActionCard'
import CreatorInfo from 'components/Common/CreatorInfo'
import Reviews from 'components/Common/Reviews'
import { acceptCourseRequest, rejectCourseRequest } from 'services/courses/requests'

const StudentCourseDetails = () => {
  const { id } = useParams()
  const history = useHistory()
  const myRef = useRef(null)
  const user = useSelector(state => state.user)

  const [course, setCourse] = useState([])
  const [announcements, setAnnouncements] = useState([])

  const [currentTab, setCurrentTab] = useState('info')

  const [reviews, setReviews] = useState([])
  const [ownReview, setOwnReview] = useState([])
  const [showReviewModal, setShowReviewModal] = useState(false)
  const [editMode, setEditMode] = useState(false)

  const [showRefundModal, setShowRefundModal] = useState(false)

  const [isReviewLoading, setIsReviewLoading] = useState(false)
  const [paginatedReviews, setPaginatedReviews] = useState([])
  const [currentPageIdx, setCurrentPageIdx] = useState(1)
  const [showLoadMore, setShowLoadMore] = useState(false)

  const changeTab = tab => {
    setCurrentTab(tab)
  }

  const approveCourse = async () => {
    const result = await acceptCourseRequest(id)
    if (result && result.success) {
      getCourseDetails()
      showNotification('success', SUCCESS, COURSE_ACCEPT_SUCCESS)
    } else {
      showNotification('error', ERROR, COURSE_ACCEPT_ERROR)
    }
  }

  const rejectCourse = async () => {
    const result = await rejectCourseRequest(id)
    if (result && result.success) {
      getCourseDetails()
      showNotification('success', SUCCESS, COURSE_REJECT_SUCCESS)
    } else {
      showNotification('error', ERROR, COURSE_REJECT_ERROR)
    }
  }

  const getCourseDetails = async () => {
    const courseDetails = await getCourseById(id)
    if (courseDetails) {
      if (!isNil(courseDetails.course)) {
        setCourse(courseDetails.course)
        if (!isNil(courseDetails.course.Reviews)) {
          setReviews(courseDetails.course.Reviews)
          initPageItems(
            setIsReviewLoading,
            courseDetails.course.Reviews,
            setPaginatedReviews,
            setCurrentPageIdx,
            setShowLoadMore,
          )
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

  const refundFormFooter = (
    <div className="row justify-content-between">
      <div className="col-auto">
        <Button type="default" size="large" onClick={() => setShowRefundModal(false)}>
          Close
        </Button>
      </div>
      <div className="col-auto">
        <Button type="primary" form="requestRefundForm" htmlType="submit" size="large">
          Request Refund
        </Button>
      </div>
    </div>
  )

  const onRequestRefund = async values => {
    const response = await getPurchasedCourses(user.accountId)
    if (response && !isNil(response.courses)) {
      const purchased = response.courses
      let cID = ''

      for (let i = 0; i < purchased.length; i += 1) {
        if (purchased[i].courseId === values.courseId) {
          cID = purchased[i].CourseContracts[0].courseContractId
        }
      }

      const response2 = await requestRefund(cID, CONTRACT_TYPES.COURSE)

      if (response2) {
        showNotification('success', SUCCESS, COURSE_REFUND_REQUESTED)
      }
    }
    setShowRefundModal(false)
  }

  useEffect(() => {
    getCourseDetails()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const CourseInfo = () => {
    return (
      <div>
        <span className="h3 font-weight-bold">{course.title}</span>
        <div className="mt-2">
          <span>{course.subTitle}</span>
        </div>

        <div className="mt-2">
          <Rate disabled defaultValue={course.rating} />
        </div>

        <div className="mt-2">
          <small className="text-muted text-uppercase">
            {`Last Updated On ${formatTime(course.updatedAt)}`}
          </small>
        </div>
        <hr className="mt-4" />

        <div className="mt-4">
          <h3>{COURSE_DESC}</h3>
          <span className="mt-4 description-body">{course.description}</span>
        </div>
      </div>
    )
  }

  const AdminCourseActions = () => {
    return (
      <div className="col-12 col-md-auto col-lg-auto mt-4 mt-md-0 text-center text-md-right">
        <Space size="large">
          <Button
            className="btn btn-success text-white"
            shape="round"
            size="large"
            icon={<CheckOutlined />}
            disabled={course.adminVerified === ADMIN_VERIFIED_ENUM.ACCEPTED}
            onClick={() => approveCourse()}
          >
            {APPROVE_COURSE}
          </Button>
          <Button
            className="btn btn-danger text-white"
            shape="round"
            size="large"
            icon={<CloseOutlined />}
            disabled={course.adminVerified === ADMIN_VERIFIED_ENUM.REJECTED}
            onClick={() => rejectCourse()}
          >
            {REJECT_COURSE}
          </Button>
        </Space>
      </div>
    )
  }

  return (
    <div>
      <div className="row pt-2 justify-content-between">
        <div className="col-12 col-md-3 col-lg-2 mt-4 mt-md-0">
          <BackBtn />
        </div>
        {user.userType === USER_TYPE_ENUM.ADMIN && <AdminCourseActions />}
      </div>
      <PageHeader type="course" course={course}>
        <div className="col-12 col-sm-auto col-lg-auto ml-lg-auto pr-0 mt-4 mt-lg-0">
          <Button
            key="course-tab"
            type={currentTab === 'info' ? 'primary' : 'default'}
            size="large"
            onClick={() => changeTab('info')}
          >
            Course Info
          </Button>
        </div>
        <div className="col-auto col-sm-auto col-lg-auto pl-sm-2 pr-0 mt-4 mt-lg-0">
          <Button
            key="announcements-tab"
            type={currentTab === 'announcements' ? 'primary' : 'default'}
            size="large"
            onClick={() => changeTab('announcements')}
          >
            Announcements
          </Button>
        </div>
        <div className="col-auto col-sm-auto col-lg-auto pl-sm-2 pr-0 mt-4 mt-lg-0">
          <Button
            key="reviews-tab"
            type={currentTab === 'reviews' ? 'primary' : 'default'}
            size="large"
            onClick={() => changeTab('reviews')}
          >
            Reviews
          </Button>
        </div>
        <div className="col-auto col-sm-auto col-lg-auto pl-sm-2 mt-4 mt-lg-0">
          <Button
            ghost
            key="lessons-scrollTo"
            type="primary"
            size="large"
            onClick={() => myRef.current.scrollIntoView({ block: 'end', behavior: 'smooth' })}
          >
            Lessons&nbsp;&nbsp;
            <ArrowDownOutlined />
          </Button>
        </div>
      </PageHeader>
      <div className="row mt-4 pl-md-5 pr-md-5 pt-lg-2">
        <div className="col-12 col-lg-7 col-xl-8">
          {currentTab === 'info' && <CourseInfo />}
          {currentTab === 'reviews' && (
            <Reviews
              reviews={reviews}
              rating={course.rating}
              isReviewLoading={isReviewLoading}
              setIsReviewLoading={setIsReviewLoading}
              paginatedReviews={paginatedReviews}
              setPaginatedReviews={setPaginatedReviews}
              currentPageIdx={currentPageIdx}
              setCurrentPageIdx={setCurrentPageIdx}
              showLoadMore={showLoadMore}
              setShowLoadMore={setShowLoadMore}
            />
          )}
          {currentTab === 'announcements' && (
            <CourseAnnouncementList announcements={announcements} />
          )}
        </div>
        <div className="col-12 col-lg-5 col-xl-4 mt-4 mt-lg-0">
          <CourseActions course={course}>
            {user.userType === USER_TYPE_ENUM.STUDENT && (
              <div className="col-12 mb-2 p-0">
                <Button
                  block
                  type="primary"
                  size="large"
                  onClick={() => {
                    setShowReviewModal(true)
                  }}
                  icon={<EditOutlined />}
                >
                  {`${editMode ? 'Edit your' : 'Add a'}  Review`}
                </Button>
              </div>
            )}
            {user.userType === USER_TYPE_ENUM.STUDENT && (
              <div className="col-12 mb-2 p-0">
                <Button
                  block
                  size="large"
                  onClick={() => {
                    setShowRefundModal(true)
                  }}
                  icon={<DollarCircleOutlined />}
                >
                  Request Course Refund
                </Button>
                <ReviewModal
                  isVisible={showReviewModal}
                  setShowReviewModal={setShowReviewModal}
                  review={ownReview}
                  onSubmitReview={onSubmitReview}
                  editMode={editMode}
                />
              </div>
            )}
            <div className="col-12 p-0">
              <ShareBtn
                quote={`${getUserFirstName(user)} is sharing this course: [${
                  course.title
                }] with you!`}
                url={`${FRONTEND_API}/courses/${course.courseId}`}
                btnSize="large"
                block
              />
            </div>
            <div className="mt-4">
              <CreatorInfo history={history} sensei={course?.Sensei} accountId={course.accountId} />
            </div>
          </CourseActions>
        </div>
      </div>
      <div className="row mt-4">
        <div className="col-auto">
          <div className="h3">
            <strong>{LESSONS}</strong>
          </div>
        </div>
      </div>
      <div className="row mt-4 pb-5" ref={myRef}>
        <div className="col-12">
          <CourseLessonsList course={course} isAdmin={user.userType === USER_TYPE_ENUM.ADMIN} />
        </div>
      </div>

      <div className="col-xl-4 col-lg-12">
        <Modal
          title="Request for Refund"
          visible={showRefundModal}
          cancelText="Close"
          centered
          onCancel={() => setShowRefundModal(false)}
          footer={refundFormFooter}
        >
          <Form
            id="requestRefundForm"
            layout="vertical"
            hideRequiredMark
            onFinish={onRequestRefund}
            onFinishFailed={onFinishFailed}
            initialValues={{
              courseId: course.courseId,
              title: course.title,
            }}
          >
            <div className="row">
              <div className="col-6">
                <Form.Item name="courseId" label="Course ID">
                  <Input disabled />
                </Form.Item>
              </div>
              <div className="col-6">
                <Form.Item name="title" label="Course Title">
                  <Input disabled />
                </Form.Item>
              </div>
            </div>
          </Form>
        </Modal>
      </div>
    </div>
  )
}

export default StudentCourseDetails

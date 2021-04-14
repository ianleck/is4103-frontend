import { CloseOutlined, DollarCircleOutlined, EditOutlined } from '@ant-design/icons'
import { Button, Modal, Form, Input, Popconfirm, Skeleton, Avatar } from 'antd'
import BackBtn from 'components/Common/BackBtn'
import PageHeader from 'components/Common/PageHeader'
import Reviews from 'components/Common/Reviews'
import MentorProfile from 'components/Mentorship/MentorProfile'
import MentorshipActions from 'components/Mentorship/MentorshipActions'
import MentorshipInfo from 'components/Mentorship/MentorshipInfo'
import TaskComponent from 'components/Mentorship/Task'
import ReviewModal from 'components/Review/ReviewModal'
import { getImage, initPageItems, showNotification } from 'components/utils'
import { CONTRACT_PROGRESS_ENUM, CONTRACT_TYPES, DEFAULT_TIMEOUT } from 'constants/constants'
import {
  CONTRACT_CANCEL_ERR,
  CONTRACT_CANCEL_SUCCESS,
  ERROR,
  MENTORSHIP_REFUND_REQUESTED,
  REVIEW_ADD_ERR,
  REVIEW_ADD_SUCCESS,
  REVIEW_EDIT_ERR,
  REVIEW_EDIT_SUCCESS,
  SUCCESS,
} from 'constants/notifications'
import { filter, isEmpty, isNil } from 'lodash'
import React, { useEffect, useState } from 'react'
import { Helmet } from 'react-helmet'
import { useSelector } from 'react-redux'
import { useHistory, useParams } from 'react-router-dom'
import { getContract, terminateMentorshipContract } from 'services/mentorship/contracts'
import { addMentorshipListingReview, editMentorshipListingReview } from 'services/review'
import { getProfile } from 'services/user'
import { requestRefund } from 'services/wallet'

const MentorshipContractView = () => {
  const { id } = useParams()
  const user = useSelector(state => state.user)
  const history = useHistory()

  const [mentorshipContract, setMentorshipContract] = useState([])
  const [mentorshipListing, setMentorshipListing] = useState([])
  const [reviews, setReviews] = useState([])
  const [isLoading, setIsLoading] = useState(true)

  const [showRefundModal, setShowRefundModal] = useState(false)
  const [isCancellable, setIsCancellable] = useState(true)

  const [currentTab, setCurrentTab] = useState('info')
  const [viewUser, setViewUser] = useState('')
  const [isBlocked, setIsBlocked] = useState('')

  const [ownReview, setOwnReview] = useState([])
  const [showReviewModal, setShowReviewModal] = useState(false)
  const [editMode, setEditMode] = useState(false)
  const [isReviewLoading, setIsReviewLoading] = useState(false)
  const [paginatedReviews, setPaginatedReviews] = useState([])
  const [currentPageIdx, setCurrentPageIdx] = useState(1)
  const [showLoadMore, setShowLoadMore] = useState(false)

  const changeTab = tab => {
    setCurrentTab(tab)
  }

  const getMentorshipContract = async () => {
    setIsLoading(true)
    const result = await getContract(id)
    console.log(result)
    if (result && !isNil(result.contract)) {
      setMentorshipContract(result.contract)
      if (!isNil(result.contract.progress)) {
        setIsCancellable(
          result.contract.progress === CONTRACT_PROGRESS_ENUM.ONGOING ||
            result.contract.progress === CONTRACT_PROGRESS_ENUM.NOT_STARTED,
        )
      }
      if (!isNil(result.contract.MentorshipListing)) {
        setMentorshipListing(result.contract.MentorshipListing)
        if (!isNil(result.contract.MentorshipListing.Reviews)) {
          setReviews(result.contract.MentorshipListing.Reviews)
          initPageItems(
            setIsReviewLoading,
            result.contract.MentorshipListing.Reviews,
            setPaginatedReviews,
            setCurrentPageIdx,
            setShowLoadMore,
          )

          const reviewByUser = filter(result.contract.MentorshipListing.Reviews, review => {
            return review.accountId === user.accountId
          })
          setOwnReview(reviewByUser)

          if (!isEmpty(reviewByUser)) {
            setEditMode(true)
          }
        }
      }
    }
    setTimeout(() => {
      setIsLoading(false)
    }, DEFAULT_TIMEOUT)
  }

  const getUserProfile = async () => {
    setIsLoading(true)
    if (!isNil(mentorshipListing.accountId)) {
      const response = await getProfile(mentorshipListing.accountId)
      if (response) {
        setViewUser(response)
        if (!isNil(response.isBlocking)) setIsBlocked(response.isBlocking)
      }
    }
    setTimeout(() => {
      setIsLoading(false)
    }, DEFAULT_TIMEOUT)
  }

  const onSubmitReview = async values => {
    const formValues = {
      rating: values.rating,
      comment: values.comment,
    }

    const payload = {
      mentorshipListingId: mentorshipListing.mentorshipListingId,
      review: { ...formValues },
    }

    if (editMode) {
      const editResponse = await editMentorshipListingReview(payload)

      if (editResponse && !isNil(editResponse.review)) {
        showNotification('success', SUCCESS, REVIEW_EDIT_SUCCESS)
      } else {
        showNotification('error', ERROR, REVIEW_EDIT_ERR)
      }
    } else {
      const addResponse = await addMentorshipListingReview(payload)

      if (addResponse && !isNil(addResponse.review)) {
        showNotification('success', SUCCESS, REVIEW_ADD_SUCCESS)
      } else {
        showNotification('error', ERROR, REVIEW_ADD_ERR)
      }
    }

    getMentorshipContract()
    setShowReviewModal(false)
  }

  const showReviewButton = () => (
    <>
      <div className="mt-3">
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
        <ReviewModal
          isVisible={showReviewModal}
          setShowReviewModal={setShowReviewModal}
          review={ownReview}
          onSubmitReview={onSubmitReview}
          editMode={editMode}
        />
      </div>
    </>
  )

  useEffect(() => {
    getMentorshipContract()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    if (currentTab === 'profile') getUserProfile()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentTab])

  console.log('mentorshipContract is ', mentorshipContract) // Nat to deal with this in a later PR to populate the page with more subscription specific deets

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

  const onFinishFailed = errorInfo => {
    console.log('Failed:', errorInfo)
  }

  const onRequestRefund = async values => {
    const response = await requestRefund(values.mentorshipContractId, CONTRACT_TYPES.MENTORSHIP)

    if (response) {
      showNotification('success', SUCCESS, MENTORSHIP_REFUND_REQUESTED)
    }
    setShowRefundModal(false)
  }

  const onCancelContract = async () => {
    const response = await terminateMentorshipContract({
      mentorshipContractId: mentorshipContract.mentorshipContractId,
      action: CONTRACT_PROGRESS_ENUM.CANCELLED,
    })

    if (response) {
      showNotification('success', SUCCESS, CONTRACT_CANCEL_SUCCESS)
      getMentorshipContract()
    } else {
      showNotification('error', ERROR, CONTRACT_CANCEL_ERR)
    }
  }

  const ExtMentorshipActions = () => {
    return (
      <MentorshipActions listing={mentorshipListing} history={history}>
        <div className="row align-items-center">
          <div className="col-6">
            <div className="text-center m-0">You have</div>
            <div className="text-center h3 m-0">{mentorshipContract.mentorPassCount}</div>
            <div className="text-center m-0">MentorPasses.</div>
          </div>
          <div className="col-6">
            <Button block type="default" size="large" style={{ height: '100%' }}>
              <div className="row text-center">
                <div className="col-12 p-1">
                  <Avatar src={getImage(mentorshipListing?.Sensei)} />
                </div>
                <div className="col-12 mt-1 text-wrap">Book a Consultation</div>
              </div>
            </Button>
          </div>
        </div>
        <div className="row">
          <div className="col-12 mb-2">{showReviewButton()}</div>
          <div className="col-12 mb-2">
            <Popconfirm
              title="Do you wish to cancel this mentorship contract?"
              onConfirm={() => onCancelContract()}
              okText="Yes"
              okType="danger"
              disabled={!isCancellable}
            >
              <Button
                block
                type="default"
                size="large"
                disabled={!isCancellable}
                icon={<CloseOutlined className="text-danger" />}
              >
                Cancel Mentorship Contract
              </Button>
            </Popconfirm>
          </div>
          <div className="col-12">
            <Button
              block
              type="default"
              size="large"
              onClick={() => setShowRefundModal(true)}
              icon={<DollarCircleOutlined className="text-info" />}
            >
              Refund All Passes
            </Button>
          </div>
        </div>
      </MentorshipActions>
    )
  }

  return (
    <div>
      <Helmet title="View Mentorship Contract" />
      <div className="row pt-2 justify-content-between">
        <div className="col-12 col-md-3 col-lg-2 mt-4 mt-md-0">
          <BackBtn />
        </div>
      </div>
      <PageHeader type="mentorship" listing={mentorshipListing}>
        <div className="col-12 col-sm-auto col-lg-auto ml-lg-auto pr-0 mt-4 mt-lg-0">
          <Button
            key="mentorship-tab"
            type={currentTab === 'info' ? 'primary' : 'default'}
            size="large"
            onClick={() => changeTab('info')}
          >
            Mentorship Info
          </Button>
        </div>
        <div className="col-auto col-sm-auto col-lg-auto pl-sm-2 pr-0 mt-4 mt-lg-0">
          <Button
            key="tasks-tab"
            type={currentTab === 'tasks' ? 'primary' : 'default'}
            size="large"
            onClick={() => changeTab('tasks')}
          >
            Tasks
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
            key="profile-tab"
            type={currentTab === 'profile' ? 'primary' : 'default'}
            size="large"
            onClick={() => changeTab('profile')}
          >
            Mentor Profile
          </Button>
        </div>
      </PageHeader>
      <div className="row mt-4 pl-md-5 pr-md-5 pt-lg-2">
        <div className="col-12 col-lg-6 col-xl-7">
          <Skeleton active loading={isLoading}>
            {currentTab === 'info' && <MentorshipInfo listing={mentorshipListing} />}
            {currentTab === 'reviews' && (
              <Reviews
                reviews={reviews}
                rating={mentorshipListing.rating}
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
            {currentTab === 'profile' && (
              <MentorProfile viewUser={viewUser} isBlocked={isBlocked} />
            )}
          </Skeleton>
        </div>
        {currentTab !== 'tasks' && (
          <div className="col-12 col-lg-6 col-xl-5">
            <ExtMentorshipActions />
          </div>
        )}
      </div>
      {currentTab === 'tasks' && (
        <div className="row">
          <div className="col-12">
            <TaskComponent />
          </div>
        </div>
      )}

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
            mentorshipContractId: mentorshipContract.mentorshipContractId,
            name: mentorshipListing.name,
            mentorPassCount: mentorshipContract.mentorPassCount,
          }}
        >
          <div className="row">
            <div className="col-6">
              <Form.Item name="mentorshipContractId" label="Mentorship Contract ID">
                <Input disabled />
              </Form.Item>
            </div>
            <div className="col-6">
              <Form.Item name="name" label="Mentorship Name">
                <Input disabled />
              </Form.Item>
            </div>
            <div className="col-12">
              <Form.Item name="mentorPassCount" label="Number of passes to be refunded">
                <Input disabled />
              </Form.Item>
            </div>
          </div>
        </Form>
      </Modal>
    </div>
  )
}

export default MentorshipContractView

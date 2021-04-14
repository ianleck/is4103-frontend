import React, { useEffect, useState } from 'react'
import { Helmet } from 'react-helmet'
import { useHistory, useParams } from 'react-router-dom'
import { getMentorshipListing } from 'services/mentorship/listings'
import { filter, isEmpty, isNil } from 'lodash'
import { useSelector } from 'react-redux'
import { Button, Rate, Skeleton } from 'antd'
import { EditOutlined } from '@ant-design/icons'
import ReviewModal from 'components/Review/ReviewModal'
import {
  ERROR,
  REVIEW_ADD_ERR,
  REVIEW_ADD_SUCCESS,
  REVIEW_EDIT_ERR,
  REVIEW_EDIT_SUCCESS,
  SUCCESS,
} from 'constants/notifications'
import { addMentorshipListingReview, editMentorshipListingReview } from 'services/review'
import { formatTime, getUserFirstName, showNotification } from 'components/utils'
import { DEFAULT_TIMEOUT, FRONTEND_API, MENTORSHIP_CONTRACT_APPROVAL } from 'constants/constants'
import BackBtn from 'components/Common/BackBtn'
import ShareBtn from 'components/Common/Social/ShareBtn'
import CreatorInfo from 'components/Common/CreatorInfo'
import { getProfile } from 'services/user'
import PersonalInformationCard from 'components/Profile/PersonalInformationCard'
import AboutCard from 'components/Profile/AboutCard'
import IndustryCard from 'components/Profile/IndustryCard'
import OccupationCard from 'components/Profile/OccupationCard'
import PersonalityCard from 'components/Profile/PersonalityCard'
import ProfileBlockedCard from 'components/Common/Social/ProfileBlockedCard'
import ProfilePrivateCard from 'components/Common/Social/ProfilePrivateCard'
import MentorshipHeader from 'components/Mentorship/MentorshipHeader'

const ViewListing = () => {
  const { id } = useParams()
  const user = useSelector(state => state.user)
  const history = useHistory()

  const [listing, setListing] = useState('')
  const [reviews, setReviews] = useState([])
  const [isLoading, setIsLoading] = useState(true)

  const [currentTab, setCurrentTab] = useState('info')
  const [viewUser, setViewUser] = useState('')
  const [isBlocked, setIsBlocked] = useState('')

  const [ownReview, setOwnReview] = useState([])
  const [showReviewModal, setShowReviewModal] = useState(false)
  const [editMode, setEditMode] = useState(false)

  const [hasExistingContract, setHasExistingContract] = useState(false)
  const [hasExistingApprovedContract, setHasExistingApprovedContract] = useState(false)

  const changeTab = tab => {
    setCurrentTab(tab)
  }

  const getUserProfile = async () => {
    setIsLoading(true)
    if (!isNil(listing.accountId)) {
      const response = await getProfile(listing.accountId)
      if (response) {
        setViewUser(response)
        if (!isNil(response.isBlocking)) setIsBlocked(response.isBlocking)
      }
    }
    setTimeout(() => {
      setIsLoading(false)
    }, DEFAULT_TIMEOUT)
  }

  const getListing = async () => {
    const response = await getMentorshipListing(id)

    if (response && !isNil(response.mentorshipListing)) {
      setListing(response.mentorshipListing)

      if (!isNil(response.mentorshipListing.Reviews)) {
        setReviews(response.mentorshipListing.Reviews)
        const reviewByUser = filter(response.mentorshipListing.Reviews, review => {
          return review.accountId === user.accountId
        })
        setOwnReview(reviewByUser)

        if (!isEmpty(reviewByUser)) {
          setEditMode(true)
        }
      }

      if (!isNil(response.existingContract && !isEmpty(response.existingContract))) {
        setHasExistingContract(true)
        if (!isNil(response.existingContract.senseiApproval)) {
          setHasExistingApprovedContract(
            response.existingContract.senseiApproval === MENTORSHIP_CONTRACT_APPROVAL.APPROVED,
          )
        }
      }
      setIsLoading(false)
    }
  }

  const onSubmitReview = async values => {
    const formValues = {
      rating: values.rating,
      comment: values.comment,
    }

    const payload = { mentorshipListingId: id, review: { ...formValues } }

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

    getListing()
    setShowReviewModal(false)
  }

  const showReviewButton = () => (
    <>
      <div className="mt-3">
        <Button
          block
          type="default"
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

  console.log('reviews are ', reviews) // needed as a placeholder, Nat to deal with it in a later PR

  const MentorshipInfo = () => {
    return (
      <>
        <div className="row p-0 mb-4 align-items-center">
          <div className="col-12">
            <Rate disabled defaultValue={listing.rating} />
          </div>
          <div className="col-12 col-lg mt-2">
            <span className="h3">{listing.name}</span>
            <br />
            <small className="text-muted text-uppercase">
              {`Last Updated On ${formatTime(listing.updatedAt)}`}
            </small>
          </div>
          <div className="col-12 col-lg-auto">
            <div className="card mb-0 border-0 shadow-none">
              <div className="card-body mt-4 mt-md-0 pt-0 pb-0 pr-3 text-center text-md-right">
                <span className="h3 align-middle">
                  {`$${parseFloat(listing.priceAmount).toFixed(2)}`}
                </span>
                <span className="align-middle">/pass</span>
              </div>
            </div>
          </div>
        </div>

        <hr className="mt-4" />
        <div className="mt-4">
          <h3>Mentorship Description</h3>
          <p className="mt-4 pb-4 description-body">{listing.description}</p>
        </div>
      </>
    )
  }

  const MentorProfile = () => {
    if (viewUser.isPrivateProfile) return <ProfilePrivateCard />
    if (!isBlocked && !viewUser.isPrivateProfile)
      return (
        <div>
          <PersonalInformationCard user={viewUser} />
          <AboutCard user={viewUser} />
          <IndustryCard user={viewUser} />
          <OccupationCard user={viewUser} />
          <PersonalityCard user={viewUser} />
        </div>
      )
    return <ProfileBlockedCard />
  }

  const MentorshipActions = () => {
    return (
      <div className="card">
        <div className="card-body">
          <div className="row align-items-center">
            <div className="col pr-0">
              <Button
                block
                type="primary"
                size="large"
                disabled={hasExistingContract}
                onClick={() => history.push(`/student/mentorship/apply/${id}`)}
              >
                Apply for Mentorship
              </Button>
            </div>
            <div className="col-auto">
              <ShareBtn
                quote={`${getUserFirstName(user)} is sharing this post with you!`}
                url={`${FRONTEND_API}/student/mentorship/view/${listing.mentorshipListingId}`}
                btnSize="large"
                block
              />
            </div>
            <div className="col-12">{hasExistingApprovedContract && showReviewButton()}</div>
          </div>
          <hr />
          <div className="mt-4">
            <CreatorInfo history={history} sensei={listing.Sensei} accountId={listing.accountId} />
          </div>
        </div>
      </div>
    )
  }

  useEffect(() => {
    getListing()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    if (currentTab === 'profile') getUserProfile()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentTab])

  return (
    <div className="ml-3 mr-3 ml-md-0 mr-md-0">
      <Helmet title="View Mentorship Listing" />
      <div className="row pt-2">
        <div className="col-12 col-md-3 col-lg-2 mt-4 mt-md-0">
          <BackBtn />
        </div>
      </div>
      <MentorshipHeader listing={listing}>
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
      </MentorshipHeader>
      <div className="row mt-4 pl-md-5 pr-md-5 pt-lg-2">
        <div className="col-12 col-lg-6 col-xl-7">
          <Skeleton active loading={isLoading}>
            {currentTab === 'info' && <MentorshipInfo />}
            {currentTab === 'profile' && <MentorProfile />}
          </Skeleton>
        </div>
        <div className="col-12 col-lg-6 col-xl-5">
          <MentorshipActions />
        </div>
      </div>
    </div>
  )
}

export default ViewListing

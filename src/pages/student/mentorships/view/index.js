import React, { useEffect, useState } from 'react'
import { Helmet } from 'react-helmet'
import { useParams } from 'react-router-dom'
import MentorshipProfilePicture from 'components/Mentorship/ListingDetails/MentorshipProfilePicture'
import MentorshipExperienceCard from 'components/Mentorship/ListingDetails/MentorshipExperienceCard'
import MentorshipDescriptionCard from 'components/Mentorship/ListingDetails/MentorshipDescriptionCard'
import MentorshipProfileHeader from 'components/Mentorship/ListingDetails/MentorshipProfileHeader'
import MentorshipPricingCard from 'components/Mentorship/ListingDetails/MentorshipPricingCard'
import { getMentorshipListing } from 'services/mentorship/listings'
import { filter, isEmpty, isNil } from 'lodash'
import { useSelector } from 'react-redux'
import { Button, Skeleton } from 'antd'
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
import { showNotification } from 'components/utils'
import { MENTORSHIP_CONTRACT_APPROVAL } from 'constants/constants'

const ViewListing = () => {
  const { id } = useParams()
  const user = useSelector(state => state.user)
  const [listing, setListing] = useState('')
  const [reviews, setReviews] = useState([])
  const [ownReview, setOwnReview] = useState([])
  const [showReviewModal, setShowReviewModal] = useState(false)
  const [editMode, setEditMode] = useState(false)
  const [hasExistingContract, setHasExistingContract] = useState(false)
  const [hasExistingApprovedContract, setHasExistingApprovedContract] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

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

  useEffect(() => {
    getListing()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

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

  return (
    <div>
      <Helmet title="View Mentorship Listing" />
      <Skeleton active loading={isLoading}>
        <MentorshipProfileHeader
          isSubscribed={hasExistingContract}
          isSubscriptionApproved={hasExistingApprovedContract}
        >
          {showReviewButton()}
        </MentorshipProfileHeader>
        <div className="row mt-4">
          <div className="col-12 col-md-2 d-flex align-items-center justify-content-center">
            <MentorshipProfilePicture listing={listing} />
          </div>
          {/* DON'T COPY STUFF FROM THIS COMPONENT */}
          <div className="col-12 col-md-5 my-2 d-flex align-items-stretch">
            <MentorshipDescriptionCard listing={listing} />
          </div>
          <div className="col-12 col-md-5 my-2 d-flex align-items-stretch">
            <MentorshipPricingCard />
          </div>
          {/* DON'T COPY STUFF FROM THIS COMPONENT */}
          <div className="col-12">
            <MentorshipExperienceCard />
          </div>
        </div>
      </Skeleton>
    </div>
  )
}

export default ViewListing

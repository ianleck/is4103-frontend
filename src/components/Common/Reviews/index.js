import React from 'react'
import { Rate } from 'antd'
import { map, size } from 'lodash'
import PaginationWrapper from 'components/Common/Pagination'
import ReviewItem from './ReviewItem'

const Reviews = ({
  reviews,
  rating,
  isReviewLoading,
  setIsReviewLoading,
  paginatedReviews,
  setPaginatedReviews,
  currentPageIdx,
  setCurrentPageIdx,
  showLoadMore,
  setShowLoadMore,
}) => {
  return (
    <div>
      <span className="h3">{`Reviews (${size(reviews)})`}</span>

      <div className="mt-2">
        <span className="align-middle">
          {rating.toFixed(1)}
          <small className="text-muted">/5&nbsp;&nbsp;</small>
        </span>
        <Rate disabled defaultValue={rating} />
      </div>

      <hr className="mb-0" />

      <PaginationWrapper
        setIsLoading={setIsReviewLoading}
        totalData={reviews}
        paginatedData={paginatedReviews}
        setPaginatedData={setPaginatedReviews}
        currentPageIdx={currentPageIdx}
        setCurrentPageIdx={setCurrentPageIdx}
        showLoadMore={showLoadMore}
        setShowLoadMore={setShowLoadMore}
        buttonStyle="link"
        wrapperContent={
          size(paginatedReviews) > 0 &&
          map(paginatedReviews, review => {
            return (
              <ReviewItem key={review.reviewId} review={review} isReviewLoading={isReviewLoading} />
            )
          })
        }
      />
    </div>
  )
}

export default Reviews

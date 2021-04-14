import React, { useEffect, useState } from 'react'
import { Empty } from 'antd'
import { filter, isNil, size } from 'lodash'
import { useSelector } from 'react-redux'
import { useParams } from 'react-router-dom'
import { getMentorshipListings } from 'services/mentorship/listings'
import ShoppingListCard from 'components/Mentorship/ShoppingListCard'
import { DEFAULT_TIMEOUT } from 'constants/constants'
import BackBtn from 'components/Common/BackBtn'
import { initPageItems } from 'components/utils'
import PaginationWrapper from 'components/Common/Pagination'

const MentorshipListingList = () => {
  const [listings, setListings] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [paginatedListings, setPaginatedListings] = useState([])
  const [currentPageIdx, setCurrentPageIdx] = useState(1)
  const [showLoadMore, setShowLoadMore] = useState(false)

  const { categoryId } = useParams()
  const categories = useSelector(state => state.categories)

  const getAllListing = async () => {
    setIsLoading(true)
    const response = await getMentorshipListings()
    if (response && !isNil(response.mentorshipListings)) {
      if (!isNil(categoryId)) {
        const filteredResults = filter(
          response.mentorshipListings,
          listing => size(filter(listing.Categories, cat => cat.categoryId === categoryId)) > 0,
        )
        setListings(filteredResults)
        initPageItems(
          setIsLoading,
          filteredResults,
          setPaginatedListings,
          setCurrentPageIdx,
          setShowLoadMore,
        )
      } else {
        setListings(response.mentorshipListings)
        initPageItems(
          setIsLoading,
          response.mentorshipListings,
          setPaginatedListings,
          setCurrentPageIdx,
          setShowLoadMore,
        )
      }
    }
    setTimeout(() => {
      setIsLoading(false)
    }, DEFAULT_TIMEOUT)
  }

  useEffect(() => {
    getAllListing()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div>
      {!isNil(categoryId) && (
        <div className="row align-items-center pt-2 mb-5">
          <div className="col-6 col-sm-4 col-md-3 col-lg-2 mt-4 mt-md-0">
            <BackBtn url="/mentorships" />
          </div>
          <div className="col mt-4 mt-md-0">
            <h3 className="m-0">{categories[categoryId].name}</h3>
          </div>
        </div>
      )}
      {isNil(categoryId) && (
        <div className="mb-5">
          <img
            src="/resources/images/pages/browse/mentorships.png"
            width="100%"
            alt="mentorship banner"
          />
        </div>
      )}
      <PaginationWrapper
        setIsLoading={setIsLoading}
        totalData={listings}
        paginatedData={paginatedListings}
        setPaginatedData={setPaginatedListings}
        currentPageIdx={currentPageIdx}
        setCurrentPageIdx={setCurrentPageIdx}
        showLoadMore={showLoadMore}
        setShowLoadMore={setShowLoadMore}
        buttonStyle="link"
        className="row"
        wrapperContent={
          size(paginatedListings) > 0 &&
          paginatedListings.map(l => {
            return (
              <ShoppingListCard listing={l} key={l.mentorshipListingId} isLoading={isLoading} />
            )
          })
        }
      />
      <div className="row">
        <div className="col-12">{size(listings) === 0 && <Empty />}</div>
      </div>
    </div>
  )
}

export default MentorshipListingList

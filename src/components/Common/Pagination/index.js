import React from 'react'
import { size } from 'lodash'
import { DEFAULT_ITEMS_PER_PAGE, DEFAULT_TIMEOUT } from 'constants/constants'
import { Button } from 'antd'
import { LOAD_MORE } from 'constants/text'

/* Usage
  1. On items to be paginated, do an initial load for the first page of items.
    setIsLoading(true)
    const result = await getCommentsByLessonId(lessonId)
    if (result && !isNil(result.comments)) {
      setComments(sortDescAndKeyCommentId(result.comments))
    }
    const tempPaginatedItems = []
    for (let i = 0; i < DEFAULT_ITEMS_PER_PAGE; i += 1) {
      tempPaginatedItems.push(result.comments[i])
    }
    setPaginatedComments(tempPaginatedItems)
    setCurrentPageIdx(1)
    setShowLoadMore(true)
    setTimeout(() => {
      setIsLoading(false)
    }, DEFAULT_TIMEOUT)
    
  2. Pass the props for the initial loaded state into PaginationWrapper to follow up.
*/

const PaginationWrapper = ({
  setIsLoading,
  totalData,
  paginatedData,
  setPaginatedData,
  currentPageIdx,
  setCurrentPageIdx,
  showLoadMore,
  setShowLoadMore,
  wrapperContent,
}) => {
  const numTotalData = size(totalData)
  const currentIdx = currentPageIdx * DEFAULT_ITEMS_PER_PAGE
  const destinationIdx = (currentPageIdx + 1) * DEFAULT_ITEMS_PER_PAGE

  const loadNextPage = () => {
    setIsLoading(true)
    if (size(paginatedData) < numTotalData) {
      const tempPaginatedItems = [...paginatedData]
      for (
        let i = currentIdx;
        i < (destinationIdx <= numTotalData ? destinationIdx : numTotalData);
        i += 1
      ) {
        tempPaginatedItems.push(totalData[i])
      }
      setPaginatedData(tempPaginatedItems)
      setCurrentPageIdx(currentPageIdx + 1)
      if (destinationIdx >= numTotalData) {
        setShowLoadMore(false)
      }
    }
    setTimeout(() => {
      setIsLoading(false)
    }, DEFAULT_TIMEOUT)
  }

  return (
    <div>
      {wrapperContent}
      <Button
        block
        ghost
        type="primary"
        size="large"
        disabled={!showLoadMore}
        onClick={() => loadNextPage()}
      >
        {LOAD_MORE}
      </Button>
    </div>
  )
}

export default PaginationWrapper

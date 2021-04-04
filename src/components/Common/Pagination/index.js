import React from 'react'
import { size } from 'lodash'
import { DEFAULT_ITEMS_PER_PAGE, DEFAULT_TIMEOUT } from 'constants/constants'
import { Button } from 'antd'
import { ALL_LOADED, LOAD_MORE } from 'constants/text'

/* Usage
  1. On items to be paginated, do an initial load for the first page of items.
    import { initPageItems } from 'components/utils'

    const [isLoading, setIsLoading] = useState(false)
    const [paginatedFollowing, setPaginatedFollowing] = useState([])
    const [currentPageIdx, setCurrentPageIdx] = useState(1)
    const [showLoadMore, setShowLoadMore] = useState(false)

    useEffect(() => {
      initPageItems(
        setIsLoading,
        followingList,
        setPaginatedFollowing,
        setCurrentPageIdx,
        setShowLoadMore,
      )
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])
    
  2. Pass the props for the initial loaded state into PaginationWrapper to follow up.

      <PaginationWrapper
        setIsLoading={setIsLoading}
        totalData={followingList}
        paginatedData={paginatedFollowing}
        setPaginatedData={setPaginatedFollowing}
        currentPageIdx={currentPageIdx}
        setCurrentPageIdx={setCurrentPageIdx}
        showLoadMore={showLoadMore}
        setShowLoadMore={setShowLoadMore}
        buttonStyle='link'
        wrapperContent={
          size(paginatedFollowing) > 0 &&
          map(paginatedFollowing, followingListItem => {
            return (
              <FollowingListItem
                key={followingListItem.followershipId}
                followingListItem={followingListItem}
                user={user}
                isLoading={isLoading}
              />
            )
          })
        }
      />
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
  buttonStyle,
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
      {numTotalData > DEFAULT_ITEMS_PER_PAGE && (
        <Button
          block
          ghost={buttonStyle !== 'link'}
          type={buttonStyle}
          disabled={!showLoadMore}
          onClick={() => loadNextPage()}
        >
          {showLoadMore ? LOAD_MORE : ALL_LOADED}
        </Button>
      )}
    </div>
  )
}

export default PaginationWrapper

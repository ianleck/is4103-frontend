import React, { useEffect, useState } from 'react'
import { useHistory } from 'react-router-dom'
import { UserOutlined } from '@ant-design/icons'
import { Avatar, Button } from 'antd'
import PaginationWrapper from 'components/Common/Pagination'
import { initPageItems, sendToSocialProfile } from 'components/utils'
import { isNil, map, size } from 'lodash'
import { useSelector } from 'react-redux'
import SocialFollowBtn from '../FollowBtn'

const SocialFollowingList = ({ followingList, isFollowingList, setShowSocialModal }) => {
  const history = useHistory()
  const user = useSelector(state => state.user)

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
  }, [followingList])

  const socialProfileOverride = accountId => {
    sendToSocialProfile(history, user, accountId)
    if (!isNil(setShowSocialModal)) setShowSocialModal(false)
  }

  const FollowingListItem = ({ followingListItem }) => {
    const FollowingListItemRow = ({ userRowItem }) => {
      return (
        <div className="row mb-3 align-items-center">
          <div
            role="button"
            tabIndex={0}
            className="col-7 col-md-9 invisible-btn"
            onClick={() => socialProfileOverride(userRowItem.accountId)}
            onKeyDown={e => e.preventDefault()}
          >
            <div className="row align-items-center">
              <div className="col-auto">
                <Avatar
                  size={32}
                  icon={<UserOutlined />}
                  src={
                    userRowItem.profileImgUrl
                      ? `${userRowItem.profileImgUrl}?${new Date().getTime()}`
                      : null
                  }
                />
              </div>
              <div className="col text-dark">
                <span className="font-size-15 font-weight-bold">{userRowItem.username}</span>
                <br />
                <span className="font-size-15">
                  {`${!isNil(userRowItem.firstName) ? userRowItem.firstName : 'Anonymous'} ${
                    !isNil(userRowItem.lastName) ? userRowItem.lastName : 'Pigeon'
                  }`}
                </span>
              </div>
            </div>
          </div>
          <div className="col-5 col-md-3 text-right">
            {isFollowingList && <SocialFollowBtn targetAccountId={userRowItem.accountId} />}
            {!isFollowingList && (
              <Button type="default" size="large">
                Remove
              </Button>
            )}
          </div>
        </div>
      )
    }

    if (isFollowingList && !isNil(followingListItem.Following)) {
      const userRowItem = followingListItem.Following
      return <FollowingListItemRow userRowItem={userRowItem} />
    }
    if (!isFollowingList && !isNil(followingListItem.Follower)) {
      const userRowItem = followingListItem.Follower
      return <FollowingListItemRow userRowItem={userRowItem} />
    }
    return null
  }
  return (
    <PaginationWrapper
      setIsLoading={setIsLoading}
      totalData={followingList}
      paginatedData={paginatedFollowing}
      setPaginatedData={setPaginatedFollowing}
      currentPageIdx={currentPageIdx}
      setCurrentPageIdx={setCurrentPageIdx}
      showLoadMore={showLoadMore}
      setShowLoadMore={setShowLoadMore}
      buttonStyle="primary"
      wrapperContent={
        size(paginatedFollowing) > 0 &&
        map(paginatedFollowing, followingListItem => {
          return (
            <FollowingListItem
              key={followingListItem.followershipId}
              followingListItem={followingListItem}
              isLoading={isLoading}
            />
          )
        })
      }
    />
  )
}

export default SocialFollowingList

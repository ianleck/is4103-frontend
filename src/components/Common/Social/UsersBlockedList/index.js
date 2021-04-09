import React, { useEffect, useState } from 'react'
import { useHistory } from 'react-router-dom'
import { UserOutlined } from '@ant-design/icons'
import { Avatar, Button } from 'antd'
import PaginationWrapper from 'components/Common/Pagination'
import {
  getUserFullName,
  initPageItems,
  sendToSocialProfile,
  showNotification,
} from 'components/utils'
import { isNil, map, size } from 'lodash'
import { useDispatch, useSelector } from 'react-redux'
import { unblockUser } from 'services/social'
import { SUCCESS, USER_UNBLOCKED } from 'constants/notifications'

const UsersBlockedList = ({ usersBlockedList, setShowSocialModal }) => {
  const history = useHistory()
  const dispatch = useDispatch()
  const user = useSelector(state => state.user)

  const [isLoading, setIsLoading] = useState(false)
  const [paginatedBlocks, setPaginatedBlocks] = useState([])
  const [currentPageIdx, setCurrentPageIdx] = useState(1)
  const [showLoadMore, setShowLoadMore] = useState(false)

  useEffect(() => {
    initPageItems(
      setIsLoading,
      usersBlockedList,
      setPaginatedBlocks,
      setCurrentPageIdx,
      setShowLoadMore,
    )
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [usersBlockedList])

  const socialProfileOverride = accountId => {
    sendToSocialProfile(history, user, accountId)
    if (!isNil(setShowSocialModal)) setShowSocialModal(false)
  }

  const unblockUserSvc = async accountId => {
    const response = await unblockUser(accountId)
    if (response && response.success) {
      dispatch({
        type: 'social/LOAD_CURRENT_SOCIAL',
      })
      showNotification('success', SUCCESS, USER_UNBLOCKED)
    }
  }

  const UserBlockItem = ({ userBlockItem }) => {
    const UserBlockItemRow = ({ userBlockRowItem }) => {
      return (
        <div className="row mb-3 align-items-center">
          <div
            role="button"
            tabIndex={0}
            className="col-7 col-md-9 clickable defocus-btn"
            onClick={() => socialProfileOverride(userBlockRowItem.accountId)}
            onKeyDown={e => e.preventDefault()}
          >
            <div className="row align-items-center">
              <div className="col-auto">
                <Avatar
                  size={32}
                  icon={<UserOutlined />}
                  src={
                    userBlockRowItem.profileImgUrl
                      ? userBlockRowItem.profileImgUrl
                      : '/resources/images/avatars/avatar-2.png'
                  }
                />
              </div>
              <div className="col text-dark">
                <span className="font-size-15 font-weight-bold">{userBlockRowItem.username}</span>
                <br />
                <span className="font-size-15">{getUserFullName(userBlockRowItem)}</span>
              </div>
            </div>
          </div>
          <div className="col text-right">
            <Button
              type="default"
              size="large"
              onClick={() => unblockUserSvc(userBlockRowItem.accountId)}
            >
              Unblock
            </Button>
          </div>
        </div>
      )
    }

    if (!isNil(userBlockItem.Follower)) {
      const userBlockRowItem = userBlockItem.Follower
      return <UserBlockItemRow userBlockRowItem={userBlockRowItem} />
    }
    return null
  }
  return (
    <PaginationWrapper
      setIsLoading={setIsLoading}
      totalData={usersBlockedList}
      paginatedData={paginatedBlocks}
      setPaginatedData={setPaginatedBlocks}
      currentPageIdx={currentPageIdx}
      setCurrentPageIdx={setCurrentPageIdx}
      showLoadMore={showLoadMore}
      setShowLoadMore={setShowLoadMore}
      buttonStyle="primary"
      wrapperContent={
        size(paginatedBlocks) > 0 &&
        map(paginatedBlocks, userBlockItem => {
          return (
            <UserBlockItem
              key={userBlockItem.followershipId}
              userBlockItem={userBlockItem}
              isLoading={isLoading}
            />
          )
        })
      }
    />
  )
}

export default UsersBlockedList

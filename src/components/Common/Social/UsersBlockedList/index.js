import React, { useEffect, useState } from 'react'
import { useHistory } from 'react-router-dom'
import { CheckOutlined, UserOutlined } from '@ant-design/icons'
import { Avatar, Button, Space } from 'antd'
import PaginationWrapper from 'components/Common/Pagination'
import { initPageItems, sendToSocialProfile } from 'components/utils'
import { isNil, map, size } from 'lodash'
import { useSelector } from 'react-redux'
import { unblockUser } from 'services/social'

const UsersBlockedList = ({ usersBlockedList, setShowSocialModal }) => {
  const history = useHistory()
  const user = useSelector(state => state.user)

  const [isLoading, setIsLoading] = useState(false)
  const [paginatedBlocks, setPaginatedBlocks] = useState([])
  const [currentPageIdx, setCurrentPageIdx] = useState(1)
  const [showLoadMore, setShowLoadMore] = useState(false)

  useEffect(() => {
    initPageItems(
      setIsLoading,
      usersBlockedList,
      paginatedBlocks,
      setCurrentPageIdx,
      setShowLoadMore,
    )
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [usersBlockedList])

  const socialProfileOverride = accountId => {
    sendToSocialProfile(history, user, accountId)
    if (!isNil(setShowSocialModal)) setShowSocialModal(false)
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
                <span className="font-size-15">
                  {`${
                    !isNil(userBlockRowItem.firstName) ? userBlockRowItem.firstName : 'Anonymous'
                  } ${!isNil(userBlockRowItem.lastName) ? userBlockRowItem.lastName : 'Pigeon'}`}
                </span>
              </div>
            </div>
          </div>
          <div className="col text-right">
            <Space>
              <Button
                className="btn btn-light"
                icon={<CheckOutlined />}
                onClick={() => unblockUser(userBlockRowItem.accountId)}
              >
                Unblock
              </Button>
            </Space>
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
        map(paginatedBlocks, blocks => {
          return <UserBlockItem key={blocks.followershipId} blocks={blocks} isLoading={isLoading} />
        })
      }
    />
  )
}

export default UsersBlockedList

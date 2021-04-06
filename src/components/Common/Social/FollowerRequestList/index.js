import React, { useEffect, useState } from 'react'
import { useHistory } from 'react-router-dom'
import { CheckOutlined, CloseOutlined, UserOutlined } from '@ant-design/icons'
import { Avatar, Button, Space } from 'antd'
import PaginationWrapper from 'components/Common/Pagination'
import { initPageItems, sendToSocialProfile } from 'components/utils'
import { isNil, map, size } from 'lodash'
import { useDispatch, useSelector } from 'react-redux'
import { SOCIAL_ACTIONS } from 'constants/constants'

const FollowerRequestList = ({ pendingFollowerList, setShowSocialModal }) => {
  const history = useHistory()
  const user = useSelector(state => state.user)
  const dispatch = useDispatch()

  const [isLoading, setIsLoading] = useState(false)
  const [paginatedRequests, setPaginatedRequests] = useState([])
  const [currentPageIdx, setCurrentPageIdx] = useState(1)
  const [showLoadMore, setShowLoadMore] = useState(false)

  useEffect(() => {
    initPageItems(
      setIsLoading,
      pendingFollowerList,
      setPaginatedRequests,
      setCurrentPageIdx,
      setShowLoadMore,
    )
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pendingFollowerList])

  const socialProfileOverride = accountId => {
    sendToSocialProfile(history, user, accountId)
    if (!isNil(setShowSocialModal)) setShowSocialModal(false)
  }

  const followerReqSvc = async (targetAccountId, type) => {
    const getAction = () => {
      if (
        [SOCIAL_ACTIONS.ACCEPT_FOLLOW_REQUEST, SOCIAL_ACTIONS.REJECT_FOLLOW_REQUEST].indexOf(
          type,
        ) !== -1
      ) {
        return `social/${type}`
      }
      return ''
    }
    if (!isNil(targetAccountId)) {
      dispatch({
        type: getAction(),
        payload: {
          targetAccountId,
        },
      })
    }
  }

  const RequestListItem = ({ requestListItem }) => {
    const RequestListItemRow = ({ userRowItem }) => {
      return (
        <div className="row mb-3 align-items-center">
          <div
            role="button"
            tabIndex={0}
            className="col-7 col-md-9 invisible-btn defocus-btn"
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
          <div className="col text-right">
            <Space>
              <Button
                className="btn btn-success text-white"
                shape="circle"
                icon={<CheckOutlined />}
                onClick={() =>
                  followerReqSvc(userRowItem.accountId, SOCIAL_ACTIONS.ACCEPT_FOLLOW_REQUEST)
                }
              />
              <Button
                className="btn btn-danger text-white"
                shape="circle"
                icon={<CloseOutlined />}
                onClick={() =>
                  followerReqSvc(userRowItem.accountId, SOCIAL_ACTIONS.REJECT_FOLLOW_REQUEST)
                }
              />
            </Space>
          </div>
        </div>
      )
    }

    if (!isNil(requestListItem.Follower)) {
      const userRowItem = requestListItem.Follower
      return <RequestListItemRow userRowItem={userRowItem} />
    }
    return null
  }
  return (
    <PaginationWrapper
      setIsLoading={setIsLoading}
      totalData={pendingFollowerList}
      paginatedData={paginatedRequests}
      setPaginatedData={setPaginatedRequests}
      currentPageIdx={currentPageIdx}
      setCurrentPageIdx={setCurrentPageIdx}
      showLoadMore={showLoadMore}
      setShowLoadMore={setShowLoadMore}
      buttonStyle="primary"
      wrapperContent={
        size(paginatedRequests) > 0 &&
        map(paginatedRequests, requestListItem => {
          return (
            <RequestListItem
              key={requestListItem.followershipId}
              requestListItem={requestListItem}
              isLoading={isLoading}
            />
          )
        })
      }
    />
  )
}

export default FollowerRequestList

import React from 'react'
import { useSelector } from 'react-redux'
import { Descriptions } from 'antd'
import { isNil } from 'lodash'
import { getUserFullName, sendToSocialProfile } from 'components/utils'
import { USER_TYPE_ENUM } from 'constants/constants'
import { CREATOR_INFO, DIGI_DOJO, NA } from 'constants/text'
import SocialFollowBtn from '../Social/FollowBtn'

const CreatorInfo = ({ history, sensei, accountId }) => {
  const user = useSelector(state => state.user)

  return (
    <div>
      <small className="text-uppercase text-secondary">{CREATOR_INFO}</small>
      <div className="row mt-2 align-items-center">
        <div className="col-auto">
          <div className="kit__utils__avatar kit__utils__avatar--size64 mb-3">
            <img
              src={
                sensei?.profileImgUrl
                  ? sensei?.profileImgUrl
                  : '/resources/images/avatars/avatar-2.png'
              }
              alt="Display Pic"
            />
          </div>
        </div>
      </div>
      <div className="row">
        <div className="col-12">
          <div
            role="button"
            tabIndex={0}
            className="h3 font-weight-bold clickable defocus-btn"
            onClick={() => sendToSocialProfile(user, history, accountId)}
            onKeyDown={e => e.preventDefault()}
          >
            {getUserFullName(sensei)}
          </div>
        </div>
        <div className="col-12 mt-2">
          <div className="h5 text-uppercase">{`${DIGI_DOJO} ${USER_TYPE_ENUM.SENSEI}`}</div>
        </div>
        <div className="col-12 mt-2">
          <SocialFollowBtn targetAccountId={accountId} />
        </div>
        <div className="col-12 mt-4">
          <Descriptions
            title="Credentials"
            bordered
            size="small"
            column={{ xxl: 1, xl: 1, lg: 1, md: 1, sm: 1, xs: 1 }}
          >
            <Descriptions.Item label="Occupation">
              {!isNil(sensei?.occupation) ? sensei?.occupation : NA}
            </Descriptions.Item>
          </Descriptions>
        </div>
      </div>
    </div>
  )
}

export default CreatorInfo

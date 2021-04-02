import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { isNil } from 'lodash'
import { getProfile } from 'services/user'
import SocialProfileCard from 'components/Common/Social/ProfileCard'

const SenseiSocialProfile = () => {
  const { accountId } = useParams()
  const [viewUser, setViewUser] = useState('')

  const getUserProfile = async () => {
    if (!isNil(accountId)) {
      const response = await getProfile(accountId)
      if (response) setViewUser(response)
    }
  }

  useEffect(() => {
    getUserProfile()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div className="container">
      <div className="row">
        <div className="col-12 col-md-5">
          <SocialProfileCard user={viewUser} />
        </div>
        <div className="col-12 col-md-7">
          <span>Hello</span>
        </div>
      </div>
    </div>
  )
}

export default SenseiSocialProfile

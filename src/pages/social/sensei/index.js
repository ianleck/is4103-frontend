import React from 'react'
import { useParams } from 'react-router-dom'

const SenseiSocialProfile = () => {
  const { accountId } = useParams()
  console.log('accountId', accountId)

  return (
    <div>
      <span>Hi</span>
    </div>
  )
}

export default SenseiSocialProfile

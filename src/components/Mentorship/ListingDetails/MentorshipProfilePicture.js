import { UserOutlined } from '@ant-design/icons'
import { Avatar } from 'antd'
import React from 'react'
// import { useSelector } from 'react-redux'

const MentorshipProfilePicture = ({ listing }) => {
  // const user = useSelector(state => state.user)

  // const imgSrc = `placeHolderURLForProfilePhoto/${user.accountId}`

  return (
    <Avatar
      size={104}
      icon={<UserOutlined />}
      src={
        listing?.Sensei?.profileImgUrl
          ? `${listing?.Sensei?.profileImgUrl}?${new Date().getTime()}`
          : '/resources/images/avatars/avatar-2.png'
      }
    />
  )
}

export default MentorshipProfilePicture

import React from 'react'
import { Helmet } from 'react-helmet'
import MentorProfile from '../../../components/Admin/VerifySensei/SenseiProfile'

const MentorPage = () => {
  return (
    <div>
      <Helmet title="Mentor's Page" />
      <MentorProfile />
    </div>
  )
}

export default MentorPage

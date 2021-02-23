import React from 'react'
import { useParams } from 'react-router-dom'
import { Helmet } from 'react-helmet'
import MentorProfile from '../../../components/Admin/VerifyMentors/MentorProfile'

const MentorPage = () => {
  const { mentorId } = useParams()

  return (
    <div>
      <Helmet title="Mentor's Page" />
      <div className="cui__utils__heading">
        <strong>User ID: {mentorId}</strong>
      </div>

      <MentorProfile />
    </div>
  )
}

export default MentorPage

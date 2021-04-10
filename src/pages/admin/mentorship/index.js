import React from 'react'
import { Helmet } from 'react-helmet'
import Mentorship from 'components/Admin/Mentorship'

const MentorshipContentManagement = () => {
  return (
    <div>
      <Helmet title="Mentorship Content Management" />
      <div className="cui__utils__heading">
        <strong>Mentorship Content Management</strong>
      </div>

      <div>
        <Mentorship />
      </div>
    </div>
  )
}

export default MentorshipContentManagement

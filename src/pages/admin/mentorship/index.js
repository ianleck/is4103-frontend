import React from 'react'
import { Helmet } from 'react-helmet'
import Mentorship from 'components/Admin/Mentorship'

const MentorshipContentManagement = () => {
  return (
    <div>
      <div className="row">
        <Helmet title="Mentorship Content Management" />
        <div className="col-auto">
          <div className="text-dark text-uppercase h3">
            <strong>Mentorship Content Management</strong>
          </div>
        </div>
      </div>

      <div className="mt-4">
        <Mentorship />
      </div>
    </div>
  )
}

export default MentorshipContentManagement

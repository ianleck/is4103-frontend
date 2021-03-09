import MentorshipApplicationsCard from 'components/Mentorship/MentorshipApplications'
import React from 'react'
import { Helmet } from 'react-helmet'

const MentorshipApplications = () => {
  return (
    <div>
      <Helmet title="Mentorship Applications" />
      <div className="row">
        <div className="col-12">
          <MentorshipApplicationsCard />
        </div>
      </div>
    </div>
  )
}

export default MentorshipApplications

import React from 'react'
import { Helmet } from 'react-helmet'
import MentorshipApplicationsTable from 'components/Mentorship/ApplicationsTable'

const SenseiMentorshipApplications = () => {
  return (
    <div>
      <Helmet title="Mentorship Applications" />
      <div className="row">
        <div className="col-12">
          <MentorshipApplicationsTable />
        </div>
      </div>
    </div>
  )
}

export default SenseiMentorshipApplications

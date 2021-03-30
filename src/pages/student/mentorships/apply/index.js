import React from 'react'
import { Helmet } from 'react-helmet'
import ApplyMentorshipForm from 'components/Student/Mentorship/ApplicationForm'

const ApplyListing = () => {
  return (
    <div>
      <Helmet title="Apply for a Mentorship" />
      <ApplyMentorshipForm />
    </div>
  )
}

export default ApplyListing

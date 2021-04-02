import React from 'react'
import { Helmet } from 'react-helmet'
import ViewSubscription from 'components/Mentorship/Subscription'

const MentorshipSubscriptionView = () => {
  return (
    <div>
      <Helmet title="Mentorship Subscription" />
      <ViewSubscription />
    </div>
  )
}

export default MentorshipSubscriptionView

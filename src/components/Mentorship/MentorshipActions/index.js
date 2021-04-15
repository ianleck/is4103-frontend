import CreatorInfo from 'components/Common/CreatorInfo'
import React from 'react'

const MentorshipActions = ({ history, listing, children }) => {
  return (
    <div className="card">
      <div className="card-body">
        {children}
        <hr />
        <div className="mt-4">
          <CreatorInfo history={history} sensei={listing.Sensei} accountId={listing.accountId} />
        </div>
      </div>
    </div>
  )
}

export default MentorshipActions

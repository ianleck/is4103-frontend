import React from 'react'
import { Helmet } from 'react-helmet'
import MentorshipTable from '../../../components/Admin/Mentorship/MentorshipTable'

const MentorshipContentManagement = () => {
  return (
    <div>
      <Helmet title="Mentorship Content Management" />
      <div className="cui__utils__heading">
        <strong>Mentorship Content Management</strong>
      </div>

      <div className="row">
        <div className="col-xl-4 col-lg-12">
          <div className="card">
            <div className="card-body">
              <h4 style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                Widget
              </h4>
              <h6 style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                Number of Mentorship Listings
              </h6>
            </div>
          </div>
        </div>

        <div className="col-xl-4 col-lg-12">
          <div className="card">
            <div className="card-body">
              <h4 style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                Widget
              </h4>
              <h6 style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                Number of Mentorship Applications
              </h6>
            </div>
          </div>
        </div>

        <div className="col-xl-4 col-lg-12">
          <div className="card">
            <div className="card-body">
              <h4 style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                Widget
              </h4>
              <h6 style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                Number of Mentorship Contracts
              </h6>
            </div>
          </div>
        </div>

        <div className="col-xl-12 col-lg-12">
          <div className="card">
            <MentorshipTable />
          </div>
        </div>
      </div>
    </div>
  )
}

export default MentorshipContentManagement

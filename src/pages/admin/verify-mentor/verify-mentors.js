import React from 'react'
import { Helmet } from 'react-helmet'
import NewMentorTable from '../../../components/Admin/VerifyMentors/NewMentorTable'

// const { TabPane } = Tabs
// const mapStateToProps = ({ user }) => ({ user })

const verifyMentors = () => {
  return (
    <div>
      <Helmet title="Verify new Mentor" />
      <div className="cui__utils__heading">
        <strong>Verify Mentors</strong>
      </div>

      <div className="row">
        <div className="col-xl-4 col-lg-12">
          <div className="card">
            <div className="card-body">
              <h4 className="d-flex align-items-center justify-content-center">Widget</h4>
              <h6 className="d-flex align-items-center justify-content-center">
                Unverified Mentors
              </h6>
            </div>
          </div>
        </div>

        <div className="col-xl-4 col-lg-12">
          <div className="card">
            <div className="card-body">
              <h4 className="d-flex align-items-center justify-content-center">Widget</h4>
              <h6 className="d-flex align-items-center justify-content-center">Verified Mentors</h6>
            </div>
          </div>
        </div>

        <div className="col-xl-4 col-lg-12">
          <div className="card">
            <div className="card-body">
              <h4 className="d-flex align-items-center justify-content-center">Widget</h4>
              <h6 className="d-flex align-items-center justify-content-center">Total Senseis</h6>
            </div>
          </div>
        </div>

        <div className="col-xl-12 col-lg-12">
          <NewMentorTable />
        </div>
      </div>
    </div>
  )
}

export default verifyMentors

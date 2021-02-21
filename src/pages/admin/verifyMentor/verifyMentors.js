import React from 'react'
import { Helmet } from 'react-helmet'
import NewMentorTable from '../../../components/Admin/VerifyMentors/newMentorTable'

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
              <h4 style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                Widget
              </h4>
              <h6 style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                Unverified Mentors
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
                Verified Mentors
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
                Total Senseis
              </h6>
            </div>
          </div>
        </div>

        <div className="col-xl-12 col-lg-12">
          <div className="card">
            <NewMentorTable />
          </div>
        </div>
      </div>
    </div>
  )
}

export default verifyMentors

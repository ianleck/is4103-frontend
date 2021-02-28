import React from 'react'
import { Helmet } from 'react-helmet'
import MentorshipTable from '../../../components/Admin/Mentorship/MentorshipTable'
import ListingsWidget from '../../../components/Admin/Mentorship/ListingsWidgets'
import ContractsWidget from '../../../components/Admin/Mentorship/ContractsWidget'
import ApplicationsWidget from '../../../components/Admin/Mentorship/ApplicationsWidget'

const MentorshipContentManagement = () => {
  return (
    <div>
      <Helmet title="Mentorship Content Management" />
      <div className="cui__utils__heading">
        <strong>Mentorship Content Management</strong>
      </div>

      <div className="row">
        <div className="col-xl-4 col-lg-12">
          <ListingsWidget />
        </div>

        <div className="col-xl-4 col-lg-12">
          <ContractsWidget />
        </div>

        <div className="col-xl-4 col-lg-12">
          <ApplicationsWidget />
        </div>

        <div className="col-xl-12 col-lg-12">
          <MentorshipTable />
        </div>
      </div>
    </div>
  )
}

export default MentorshipContentManagement

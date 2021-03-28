import React from 'react'
import { Helmet } from 'react-helmet'
import Charting from '../../../components/Admin/AdminDashboard/Charting'
import StatsTable from '../../../components/Admin/AdminDashboard/StatsTable'
import ActionableTable from '../../../components/Admin/AdminDashboard/ActionableTable'
import StudentWidget from '../../../components/Admin/UsersManagement/StudentWidget'
import SenseiWidget from '../../../components/Admin/UsersManagement/SenseiWidget'
import ActiveAdminWidget from '../../../components/Admin/AdminManagement/ActiveAdminWidget'

const AdminDashboard = () => {
  return (
    <div className="container">
      <Helmet title="Admin Overview" />
      <div className="cui__utils__heading">
        <strong>Admin Dashboard</strong>
      </div>

      <div className="row mt-4">
        <div className="col-12 col-sm-4">
          <StudentWidget />
        </div>
        <div className="col-12 col-sm-4">
          <SenseiWidget />
        </div>
        <div className="col-12 col-sm-4">
          <ActiveAdminWidget />
        </div>
      </div>

      <div className="row">
        <div className="col-xl-12 col-lg-12">
          <Charting />
        </div>

        <div className="col-xl-12 col-lg-12">
          <StatsTable />
        </div>

        <div className="col-xl-12 col-lg-12">
          <ActionableTable />
        </div>
      </div>
    </div>
  )
}

export default AdminDashboard

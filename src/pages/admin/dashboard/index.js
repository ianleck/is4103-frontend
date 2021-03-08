import React from 'react'
import { Helmet } from 'react-helmet'
import Charting from '../../../components/Admin/AdminDashboard/Charting'
import Table1 from '../../../components/Admin/AdminDashboard/Table1'
import Table2 from '../../../components/Admin/AdminDashboard/Table2'
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
          <Table1 />
        </div>

        <div className="col-xl-12 col-lg-12">
          <Table2 />
        </div>
      </div>
    </div>
  )
}

export default AdminDashboard

import React from 'react'
import { Helmet } from 'react-helmet'
import Charting from '../../../components/Admin/AdminDashboard/Charting'
import Table1 from '../../../components/Admin/AdminDashboard/Table1'
import Table2 from '../../../components/Admin/AdminDashboard/Table2'

const AdminDashboard = () => {
  return (
    <div>
      <Helmet title="Admin Overview" />
      <div className="cui__utils__heading">
        <strong>Admin Dashboard</strong>
      </div>

      <div className="row">
        <div className="col-xl-4 col-lg-12">
          <div className="card">
            <div className="card-body">
              <h4 className="d-flex align-items-center justify-content-center">Widget</h4>
              <h6 className="d-flex align-items-center justify-content-center">
                Number of Student Accounts
              </h6>
            </div>
          </div>
        </div>

        <div className="col-xl-4 col-lg-12">
          <div className="card">
            <div className="card-body">
              <h4 className="d-flex align-items-center justify-content-center">Widget</h4>
              <h6 className="d-flex align-items-center justify-content-center">
                Number of Sensei Accounts
              </h6>
            </div>
          </div>
        </div>

        <div className="col-xl-4 col-lg-12">
          <div className="card">
            <div className="card-body">
              <h4 className="d-flex align-items-center justify-content-center">Widget</h4>
              <h6 className="d-flex align-items-center justify-content-center">
                Number of Admin Accounts
              </h6>
            </div>
          </div>
        </div>

        <div className="col-xl-4 col-lg-12">
          <div className="card">
            <div className="card-body">
              <h4 className="d-flex align-items-center justify-content-center text-primary">
                Widget
              </h4>
              <h6 className="d-flex align-items-center justify-content-center">Revenue</h6>
            </div>
          </div>
        </div>

        <div className="col-xl-4 col-lg-12">
          <div className="card">
            <div className="card-body">
              <h4 className="d-flex align-items-center justify-content-center text-success">
                Widget
              </h4>
              <h6 className="d-flex align-items-center justify-content-center">Profits</h6>
            </div>
          </div>
        </div>

        <div className="col-xl-4 col-lg-12">
          <div className="card">
            <div className="card-body">
              <h4 className="d-flex align-items-center justify-content-center text-danger">
                Widget
              </h4>
              <h6 className="d-flex align-items-center justify-content-center">Refunds</h6>
            </div>
          </div>
        </div>

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

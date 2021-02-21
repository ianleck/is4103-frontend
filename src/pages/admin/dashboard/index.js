import React from 'react'
import { Tabs } from 'antd'
import { Helmet } from 'react-helmet'
import StudentGrowthChart from '../../../components/Admin/AdminDashboard/StudentGrowthChart'
import SenseiGrowthChart from '../../../components/Admin/AdminDashboard/SenseiGrowthChart'

const { TabPane } = Tabs

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
          <div className="card">
            <Tabs className="kit-tabs-bordered pt-2" defaultActiveKey="1">
              <TabPane tab="Students" key="1">
                <div className="card-body">
                  <StudentGrowthChart />
                </div>
              </TabPane>
              <TabPane tab="Senseis" key="2">
                <div className="card-body">
                  <SenseiGrowthChart />
                </div>
              </TabPane>
            </Tabs>
          </div>
        </div>

        <div className="col-xl-6 col-lg-12">
          <div className="card">
            <Tabs className="kit-tabs-bordered pt-2" defaultActiveKey="1">
              <TabPane tab="Top Rated Senseis" key="1">
                <div className="card-body">Sensei table</div>
              </TabPane>
              <TabPane tab="Top Rated Courses" key="2">
                <div className="card-body">Course Table</div>
              </TabPane>
              <TabPane tab="Top Rated Subjects" key="3">
                <div className="card-body">Subject Table</div>
              </TabPane>
            </Tabs>
          </div>
        </div>

        <div className="col-xl-6 col-lg-12">
          <div className="card">
            <Tabs className="kit-tabs-bordered pt-2" defaultActiveKey="1">
              <TabPane tab="Support Requests" key="1">
                <div className="card-body">Support Requests Table</div>
              </TabPane>
              <TabPane tab="Complaints" key="2">
                <div className="card-body">Complaint Table</div>
              </TabPane>
              <TabPane tab="Chats" key="3">
                <div className="card-body">Chats</div>
              </TabPane>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AdminDashboard

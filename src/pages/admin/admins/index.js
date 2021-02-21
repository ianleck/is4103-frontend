import React from 'react'
import { Button } from 'antd'
import { UserAddOutlined } from '@ant-design/icons'
import { Helmet } from 'react-helmet'
import AdminTable from '../../../components/Admin/AdminManagement/AdminTable'

// const { TabPane } = Tabs

const AdminsManagement = () => {
  return (
    <div>
      <Helmet title="Admin Management" />
      <div className="cui__utils__heading">
        <strong>User Management</strong>
      </div>

      <div className="row">
        <div className="col-xl-12 col-lg-12">
          <div className="col-xl-3 col-lg-12" style={{ float: 'right' }}>
            <div className="card bg-primary">
              <Button icon={<UserAddOutlined />}>Add new Admin</Button>
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
                Number of Active Admin Accounts
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
                Number of Super Admin Accounts
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
                Number of Inactive Admin Accounts
              </h6>
            </div>
          </div>
        </div>

        <div className="col-xl-12 col-lg-12">
          <div className="card">
            <AdminTable />
          </div>

          {/* <div className="card">
            <Tabs className="kit-tabs-bordered pt-2" defaultActiveKey="1">
              <TabPane tab="Bestsellers" key="1" />
              <TabPane tab="Most Viewed" key="2" />
              <TabPane tab="Highest Rated" key="3" />
            </Tabs>
          </div> */}
        </div>
      </div>
    </div>
  )
}

export default AdminsManagement

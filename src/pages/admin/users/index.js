import React from 'react'
import { useHistory } from 'react-router-dom'
import { Button } from 'antd'
import { UserAddOutlined } from '@ant-design/icons'
import { Helmet } from 'react-helmet'
import UserTable from '../../../components/Admin/UsersManagement/UserTable'
import BannedTable from '../../../components/Admin/UsersManagement/BannedTable'

// const { TabPane } = Tabs
// const mapStateToProps = ({ user }) => ({ user })

const UsersManagement = () => {
  const history = useHistory()

  const verifyNewMentor = e => {
    e.preventDefault()
    const path = '/admin/user-management/verify-mentors'
    history.push(path)
  }

  return (
    <div>
      <Helmet title="User Management" />
      <div className="cui__utils__heading">
        <strong>User Management</strong>
      </div>

      <div className="row">
        <div className="col-xl-12 col-lg-12">
          <div className="col-xl-3 col-lg-12" style={{ float: 'right' }}>
            <div className="card bg-primary">
              <Button onClick={verifyNewMentor} icon={<UserAddOutlined />}>
                Verify new mentor
              </Button>
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
                Number of Student Accounts
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
                Number of Sensei Accounts
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
                Banned Accounts
              </h6>
            </div>
          </div>
        </div>

        <div className="col-xl-12 col-lg-12">
          <div className="card">
            <UserTable />
          </div>

          {/* <div className="card">
            <Tabs className="kit-tabs-bordered pt-2" defaultActiveKey="1">
              <TabPane tab="Bestsellers" key="1" />
              <TabPane tab="Most Viewed" key="2" />
              <TabPane tab="Highest Rated" key="3" />
            </Tabs>
          </div> */}
        </div>

        <div className="col-xl-12 col-lg-12">
          <div className="card">
            <BannedTable />
          </div>
        </div>
      </div>
    </div>
  )
}

export default UsersManagement

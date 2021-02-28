import React from 'react'
import { useHistory } from 'react-router-dom'
import { Button } from 'antd'
import { UserAddOutlined } from '@ant-design/icons'
import { Helmet } from 'react-helmet'
import UserTable from '../../../components/Admin/UsersManagement/UserTable'
import BannedTable from '../../../components/Admin/UsersManagement/BannedTable'
import StudentWidget from '../../../components/Admin/UsersManagement/StudentWidget'
import SenseiWidget from '../../../components/Admin/UsersManagement/SenseiWidget'
import BannedWidget from '../../../components/Admin/UsersManagement/BannedWidget'

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
            <div className="card">
              <Button
                type="primary"
                shape="round"
                onClick={verifyNewMentor}
                icon={<UserAddOutlined />}
              >
                Verify new mentor
              </Button>
            </div>
          </div>
        </div>

        <div className="col-xl-4 col-lg-12">
          <StudentWidget />
        </div>

        <div className="col-xl-4 col-lg-12">
          <SenseiWidget />
        </div>

        <div className="col-xl-4 col-lg-12">
          <BannedWidget />
        </div>

        <div className="col-xl-12 col-lg-12">
          <UserTable />
        </div>

        <div className="col-xl-12 col-lg-12">
          <BannedTable />
        </div>
      </div>
    </div>
  )
}

export default UsersManagement

import React from 'react'
import { useHistory } from 'react-router-dom'
import { Button } from 'antd'
import { UserAddOutlined } from '@ant-design/icons'
import { Helmet } from 'react-helmet'
import UserTable from 'components/Admin/UsersManagement/UserTable'
import BannedTable from 'components/Admin/UsersManagement/BannedTable'
import StudentWidget from 'components/Admin/UsersManagement/StudentWidget'
import SenseiWidget from 'components/Admin/UsersManagement/SenseiWidget'
import BannedWidget from 'components/Admin/UsersManagement/BannedWidget'

const UsersManagement = () => {
  const history = useHistory()

  const verifyNewMentor = e => {
    e.preventDefault()
    const path = '/admin/user-management/verify-senseis'
    history.push(path)
  }

  return (
    <div>
      <div className="row">
        <Helmet title="User Management" />
        <div className="col-auto">
          <div className="text-dark text-uppercase h3">
            <strong>User Management</strong>
          </div>
        </div>
      </div>

      <div className="row justify-content-end">
        <div className="col-12 col-md-auto mt-4 mt-md-0">
          <Button
            block
            type="primary"
            shape="round"
            size="large"
            onClick={verifyNewMentor}
            icon={<UserAddOutlined />}
          >
            Verify New Senseis
          </Button>
        </div>
      </div>

      <div className="row mt-4">
        <div className="col-12 col-sm-4">
          <StudentWidget />
        </div>
        <div className="col-12 col-sm-4">
          <SenseiWidget />
        </div>
        <div className="col-12 col-sm-4">
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

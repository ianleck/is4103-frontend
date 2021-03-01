import React from 'react'
import { useSelector } from 'react-redux'
import { useHistory } from 'react-router-dom'
import { Button } from 'antd'
import { UserAddOutlined } from '@ant-design/icons'
import { Helmet } from 'react-helmet'
import AdminTable from '../../../components/Admin/AdminManagement/AdminTable'
import ActiveAdminWidget from '../../../components/Admin/AdminManagement/ActiveAdminWidget'
import SuperAdminWidget from '../../../components/Admin/AdminManagement/SuperAdminWidget'
import NormalAdminWidget from '../../../components/Admin/AdminManagement/NormalAdminWidget'

// const { TabPane } = Tabs

const AdminsManagement = () => {
  const user = useSelector(state => state.user)
  const isSuperAdmin = user.permission === 'SUPERADMIN'

  const history = useHistory()

  const addNewAdmin = e => {
    e.preventDefault()
    const path = '/admin/admin-management/add-admin'
    history.push(path)
  }

  return (
    <div>
      <Helmet title="Admin Management" />
      <div className="cui__utils__heading">
        <strong>Admin Management</strong>
      </div>

      {isSuperAdmin ? (
        <div className="row">
          <div className="col-xl-12 col-lg-12">
            <div className="col-xl-3 col-lg-12" style={{ float: 'right' }}>
              <div className="card">
                <Button
                  type="primary"
                  shape="round"
                  onClick={addNewAdmin}
                  icon={<UserAddOutlined />}
                >
                  Add new Admin
                </Button>
              </div>
            </div>
          </div>

          <div className="col-xl-4 col-lg-12">
            <NormalAdminWidget />
          </div>

          <div className="col-xl-4 col-lg-12">
            <SuperAdminWidget />
          </div>

          <div className="col-xl-4 col-lg-12">
            <ActiveAdminWidget />
          </div>

          <div className="col-xl-12 col-lg-12">
            <AdminTable />
          </div>
        </div>
      ) : (
        <div className="container pl-5 pr-5 pt-5 pb-5 mb-auto text-dark font-size-32">
          <div className="font-weight-bold mb-3 d-flex align-items-center justify-content-center">
            No permission
          </div>
          <div className="text-gray-6 font-size-24 d-flex align-items-center justify-content-center">
            Only Super Admins may access this page...
          </div>
        </div>
      )}
    </div>
  )
}

export default AdminsManagement

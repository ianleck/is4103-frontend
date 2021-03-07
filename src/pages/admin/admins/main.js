import React from 'react'
import { useSelector } from 'react-redux'
import { useHistory } from 'react-router-dom'
import { Button } from 'antd'
import { UserAddOutlined } from '@ant-design/icons'
import { Helmet } from 'react-helmet'
import AdminTable from 'components/Admin/AdminManagement/AdminTable'
import ActiveAdminWidget from 'components/Admin/AdminManagement/ActiveAdminWidget'
import SuperAdminWidget from 'components/Admin/AdminManagement/SuperAdminWidget'
import NormalAdminWidget from 'components/Admin/AdminManagement/NormalAdminWidget'
import { ADMIN_ROLE_ENUM } from 'constants/constants'

const AdminsManagement = () => {
  const user = useSelector(state => state.user)
  const history = useHistory()
  const isSuperAdmin = user.role === ADMIN_ROLE_ENUM.SUPERADMIN

  const addNewAdmin = e => {
    e.preventDefault()
    const path = '/admin/admin-management/add-admin'
    history.push(path)
  }

  return (
    <div>
      <div className="row">
        <Helmet title="Admin Management" />
        <div className="col-auto">
          <div className="text-dark text-uppercase h3">
            <strong>Admin Management</strong>
          </div>
        </div>
      </div>
      {isSuperAdmin ? (
        <div>
          <div className="row justify-content-end">
            <div className="col-12 col-md-auto mt-4 mt-md-0">
              <Button
                block
                type="primary"
                shape="round"
                size="large"
                onClick={addNewAdmin}
                icon={<UserAddOutlined />}
              >
                Add New Admin
              </Button>
            </div>
          </div>

          <div className="row mt-4">
            <div className="col-12 col-sm-4">
              <NormalAdminWidget />
            </div>

            <div className="col-12 col-sm-4">
              <SuperAdminWidget />
            </div>

            <div className="col-12 col-sm-4">
              <ActiveAdminWidget />
            </div>

            <div className="col-xl-12 col-lg-12">
              <AdminTable />
            </div>
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

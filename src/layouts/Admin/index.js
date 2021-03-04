import CustomLayout from 'components/Layout/CustomLayout'
import React from 'react'
import { withRouter } from 'react-router-dom'

const AdminLayout = ({ children }) => {
  return <CustomLayout isPublic={false}>{children}</CustomLayout>
}

export default withRouter(AdminLayout)

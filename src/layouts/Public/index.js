import React from 'react'
import { withRouter } from 'react-router-dom'
import CustomLayout from 'components/Layout/CustomLayout'

const PublicLayout = ({ children }) => {
  return <CustomLayout isPublic>{children}</CustomLayout>
}

export default withRouter(PublicLayout)

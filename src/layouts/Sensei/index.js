import React from 'react'
import { withRouter } from 'react-router-dom'
import CustomLayout from 'components/Layout/CustomLayout'

const SenseiLayout = ({ children }) => {
  return <CustomLayout isPublic={false}>{children}</CustomLayout>
}

export default withRouter(SenseiLayout)

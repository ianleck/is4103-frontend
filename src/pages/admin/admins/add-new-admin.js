import React from 'react'
import { Helmet } from 'react-helmet'
import NewAdmin from '../../../components/Admin/AdminManagement/NewAdmin'

// const mapStateToProps = ({ user }) => ({ user })

const addNewAdmin = () => {
  return (
    <div>
      <Helmet title="Add New Admin" />
      <NewAdmin />
    </div>
  )
}

export default addNewAdmin

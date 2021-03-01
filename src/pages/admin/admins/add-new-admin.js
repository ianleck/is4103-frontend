import React from 'react'
import { Helmet } from 'react-helmet'
import NewAdmin from '../../../components/Admin/AdminManagement/NewAdmin'

// const mapStateToProps = ({ user }) => ({ user })

const addNewAdmin = () => {
  return (
    <div>
      <Helmet title="Add new Admin" />
      <div className="cui__utils__heading">
        <strong>Add new Admin</strong>
      </div>

      <div className="row">
        <NewAdmin />
      </div>
    </div>
  )
}

export default addNewAdmin

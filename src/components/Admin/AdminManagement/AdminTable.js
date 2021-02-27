import React, { useEffect, useState } from 'react'
import { Tabs } from 'antd'
import * as jwtAdmin from 'services/jwt/admin'

const { TabPane } = Tabs
// const { Column, ColumnGroup } = Table

const AdminTable = () => {
  const [tabKey, setTabKey] = useState('1')
  const [admins, setAdmins] = useState([])

  useEffect(() => {
    populateAdmin()
  }, [])

  const populateAdmin = async () => {
    const response = await jwtAdmin.getAllAdmins()
    setAdmins([response.admins])
  }

  const changeTab = key => {
    setTabKey(key)
  }

  const showAdmins = () => {
    console.log(admins)
    return <div>Hello</div>
  }

  return (
    <div className="card">
      <div className="card-header card-header-flex">
        <div className="d-flex flex-column justify-content-center mr-auto">
          <h5>List of Admins</h5>
        </div>
        <Tabs activeKey={tabKey} className="kit-tabs" onChange={changeTab}>
          <TabPane tab="Admin" key="1" />
        </Tabs>
      </div>

      <div className="card-body">{tabKey === '1' && showAdmins()}</div>
    </div>
  )
}

export default AdminTable

import React, { useState } from 'react'
import { Tabs } from 'antd'

const { TabPane } = Tabs

const AdminTable = () => {
  const [tabKey, setTabKey] = useState('1')

  const changeTab = key => {
    setTabKey(key)
  }

  const showAdmins = () => {
    return <div>Admin Charts</div>
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

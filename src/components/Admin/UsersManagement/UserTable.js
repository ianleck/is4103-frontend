import React, { useState } from 'react'
import { Tabs } from 'antd'

const { TabPane } = Tabs

const UserTable = () => {
  const [tabKey, setTabKey] = useState('1')

  const changeTab = key => {
    setTabKey(key)
  }

  const showStudent = () => {
    return <div>Student Chart</div>
  }

  const showSensei = () => {
    return <div>Sensei Chart</div>
  }

  return (
    <div className="card">
      <div className="card-header card-header-flex">
        <div className="d-flex flex-column justify-content-center mr-auto">
          <h5>List of Users</h5>
        </div>
        <Tabs activeKey={tabKey} className="kit-tabs" onChange={changeTab}>
          <TabPane tab="Students" key="1" />
          <TabPane tab="Senseis" key="2" />
        </Tabs>
      </div>

      <div className="card-body">
        {tabKey === '1' && showStudent()}
        {tabKey === '2' && showSensei()}
      </div>
    </div>
  )
}

export default UserTable

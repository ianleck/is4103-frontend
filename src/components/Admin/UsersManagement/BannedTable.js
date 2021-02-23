import React, { useState } from 'react'
import { Tabs } from 'antd'

const { TabPane } = Tabs

const BannedTable = () => {
  const [tabKey, setTabKey] = useState('1')

  const changeTab = key => {
    setTabKey(key)
  }

  const showBannedStudent = () => {
    return <div>Sensei Table</div>
  }

  const showBannedSensei = () => {
    return <div>Courses Table</div>
  }

  return (
    <div className="card">
      <div className="card-header card-header-flex">
        <div className="d-flex flex-column justify-content-center mr-auto">
          <h5>List of Banned Users</h5>
        </div>
        <Tabs activeKey={tabKey} className="kit-tabs" onChange={changeTab}>
          <TabPane tab="Banned Students" key="1" />
          <TabPane tab="Banned Senseis" key="2" />
        </Tabs>
      </div>

      <div className="card-body">
        {tabKey === '1' && showBannedStudent()}
        {tabKey === '2' && showBannedSensei()}
      </div>
    </div>
  )
}

export default BannedTable

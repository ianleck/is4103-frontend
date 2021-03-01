import React, { useState } from 'react'
import { Tabs } from 'antd'

const { TabPane } = Tabs

const Table2 = () => {
  const [tabKey, setTabKey] = useState('1')

  const changeTab = key => {
    setTabKey(key)
  }

  const showSupportRequests = () => {
    return <div>Support Requests</div>
  }

  const showComplaints = () => {
    return <div>Complaints</div>
  }

  const showChats = () => {
    return <div>Chats</div>
  }

  return (
    <div className="card">
      <div className="card-header card-header-flex">
        <div className="d-flex flex-column justify-content-center mr-auto">
          <h5>Actionable Items</h5>
        </div>
        <Tabs activeKey={tabKey} className="kit-tabs" onChange={changeTab}>
          <TabPane tab="Support Requests" key="1" />
          <TabPane tab="Complaints" key="2" />
          <TabPane tab="Chats" key="3" />
        </Tabs>
      </div>

      <div className="card-body">
        {tabKey === '1' && showSupportRequests()}
        {tabKey === '2' && showComplaints()}
        {tabKey === '3' && showChats()}
      </div>
    </div>
  )
}

export default Table2

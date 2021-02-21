import React from 'react'
import { Tabs } from 'antd'

const { TabPane } = Tabs

const UserTable = () => {
  return (
    <Tabs className="kit-tabs-bordered pt-2" defaultActiveKey="1">
      <TabPane tab="Students" key="1">
        <div className="card-body">Student Chart</div>
      </TabPane>
      <TabPane tab="Senseis" key="2">
        <div className="card-body">Sensei Chart</div>
      </TabPane>
    </Tabs>
  )
}

export default UserTable

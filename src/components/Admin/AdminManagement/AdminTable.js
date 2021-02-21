import React from 'react'
import { Tabs } from 'antd'

const { TabPane } = Tabs

const AdminTable = () => {
  return (
    <Tabs className="kit-tabs-bordered pt-2" defaultActiveKey="1">
      <TabPane tab="Admins" key="1">
        <div className="card-body">Admins Chart</div>
      </TabPane>
    </Tabs>
  )
}

export default AdminTable

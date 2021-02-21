import React from 'react'
import { Tabs } from 'antd'

const { TabPane } = Tabs

const BannedTable = () => {
  return (
    <Tabs className="kit-tabs-bordered pt-2" defaultActiveKey="1">
      <TabPane tab="Banned Student" key="1">
        <div className="card-body">Banned Student Table</div>
      </TabPane>
      <TabPane tab="Banned Sensei" key="2">
        <div className="card-body">Banned Sensei Table</div>
      </TabPane>
    </Tabs>
  )
}

export default BannedTable

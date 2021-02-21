import React from 'react'
import { Tabs } from 'antd'

const { TabPane } = Tabs

const MentorshipTable = () => {
  return (
    <Tabs className="kit-tabs-bordered pt-2" defaultActiveKey="1">
      <TabPane tab="Listings" key="1">
        <div className="card-body">Mentorship Listings Chart</div>
      </TabPane>
      <TabPane tab="Applications" key="2">
        <div className="card-body">Mentorship Applications Chart</div>
      </TabPane>
      <TabPane tab="Contracts" key="3">
        <div className="card-body">Mentorship Contracts Chart</div>
      </TabPane>
    </Tabs>
  )
}

export default MentorshipTable

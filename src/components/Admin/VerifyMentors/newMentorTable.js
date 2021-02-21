import React from 'react'
import { Tabs } from 'antd'

const { TabPane } = Tabs

const NewMentorTable = () => {
  return (
    <Tabs className="kit-tabs-bordered pt-2" defaultActiveKey="1">
      <TabPane tab="New Mentors" key="1">
        <div className="card-body">New Mentor Chart</div>
      </TabPane>
    </Tabs>
  )
}

export default NewMentorTable

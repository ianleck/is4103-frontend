import React, { useState } from 'react'
import { Tabs } from 'antd'

const { TabPane } = Tabs

const NewMentorTable = () => {
  const [tabKey, setTabKey] = useState('1')

  const changeTab = key => {
    setTabKey(key)
  }

  const showNewMentors = () => {
    return <div>New Mentor Chart</div>
  }

  return (
    <div className="card">
      <div className="card-header card-header-flex">
        <div className="d-flex flex-column justify-content-center mr-auto">
          <h5>List of New Mentors</h5>
        </div>
        <Tabs activeKey={tabKey} className="kit-tabs" onChange={changeTab}>
          <TabPane tab="New Mentors" key="1" />
        </Tabs>
      </div>

      <div className="card-body">{tabKey === '1' && showNewMentors()}</div>
    </div>
  )
}

export default NewMentorTable

import React, { useState } from 'react'
import { Tabs } from 'antd'

const { TabPane } = Tabs

const MentorshipTable = () => {
  const [tabKey, setTabKey] = useState('1')

  const changeTab = key => {
    setTabKey(key)
  }

  const showListings = () => {
    return <div>Mentorship Listing Chart</div>
  }

  const showApplications = () => {
    return <div>Mentorship Application Chart</div>
  }

  const showContracts = () => {
    return <div>Mentorship Contracts Chart</div>
  }

  return (
    <div className="card">
      <div className="card-header card-header-flex">
        <div className="d-flex flex-column justify-content-center mr-auto">
          <h5>Mentorship</h5>
        </div>
        <Tabs activeKey={tabKey} className="kit-tabs" onChange={changeTab}>
          <TabPane tab="Listings" key="1" />
          <TabPane tab="Applications" key="2" />
          <TabPane tab="Contracts" key="3" />
        </Tabs>
      </div>

      <div className="card-body">
        {tabKey === '1' && showListings()}
        {tabKey === '2' && showApplications()}
        {tabKey === '3' && showContracts()}
      </div>
    </div>
  )
}

export default MentorshipTable

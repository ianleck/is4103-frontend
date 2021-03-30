import React, { useState } from 'react'
import { Tabs } from 'antd'
import StudentGrowthChart from '../StudentGrowthChart'
import SenseiGrowthChart from '../SenseiGrowthChart'

const { TabPane } = Tabs

const Charting = () => {
  const [tabKey, setTabKey] = useState('1')

  const changeTab = key => {
    setTabKey(key)
  }

  const showSenseis = () => {
    return <SenseiGrowthChart />
  }

  const showStudents = () => {
    return <StudentGrowthChart />
  }

  return (
    <div className="card">
      <div className="card-header card-header-flex">
        <div className="d-flex flex-column justify-content-center mr-auto">
          <h5>Charts</h5>
        </div>
        <Tabs activeKey={tabKey} className="kit-tabs" onChange={changeTab}>
          <TabPane tab="Student" key="1" />
          <TabPane tab="Senseis" key="2" />
        </Tabs>
      </div>

      <div className="card-body">
        {tabKey === '1' && showStudents()}
        {tabKey === '2' && showSenseis()}
      </div>
    </div>
  )
}

export default Charting

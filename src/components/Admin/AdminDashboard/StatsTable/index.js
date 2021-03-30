import React, { useState } from 'react'
import { Tabs } from 'antd'

const { TabPane } = Tabs

const Table1 = () => {
  const [tabKey, setTabKey] = useState('1')

  const changeTab = key => {
    setTabKey(key)
  }

  const showTopSensei = () => {
    return <div>Sensei Table</div>
  }

  const showTopCourses = () => {
    return <div>Courses Table</div>
  }

  const showTopSubjects = () => {
    return <div>Subject Table</div>
  }

  return (
    <div className="card">
      <div className="card-header card-header-flex">
        <div className="d-flex flex-column justify-content-center mr-auto">
          <h5>Analytics</h5>
        </div>
        <Tabs activeKey={tabKey} className="kit-tabs" onChange={changeTab}>
          <TabPane tab="Top Rated Senseis" key="1" />
          <TabPane tab="Top Rated Courses" key="2" />
          <TabPane tab="Top Rated Subjects" key="3" />
        </Tabs>
      </div>

      <div className="card-body">
        {tabKey === '1' && showTopSensei()}
        {tabKey === '2' && showTopCourses()}
        {tabKey === '3' && showTopSubjects()}
      </div>
    </div>
  )
}

export default Table1

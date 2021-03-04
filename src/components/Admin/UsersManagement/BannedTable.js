import React, { useState, useEffect } from 'react'
import { useHistory } from 'react-router-dom'
import * as jwtAdmin from 'services/jwt/admin'
import { Tabs, Table, Button } from 'antd'
import { InfoCircleOutlined } from '@ant-design/icons'

const { TabPane } = Tabs
const { Column } = Table

const BannedTable = () => {
  const [tabKey, setTabKey] = useState('1')
  const changeTab = key => {
    setTabKey(key)
  }
  const [students, setStudents] = useState()
  const [senseis, setSenseis] = useState()
  const history = useHistory()

  // console.log('user', user)
  // console.log('students', students)
  // console.log('History', history)

  useEffect(() => {
    populateStudents()
    populateSenseis()
  }, [])

  const populateStudents = async () => {
    const response = await jwtAdmin.getAllStudents()
    let banned = []

    for (let i = 0; i < response.length; i += 1) {
      if (response[i].status === 'DEACTIVATED') {
        banned = [...banned, response[i]]
      }
      // console.log('banned', banned)
    }

    setStudents(banned)
  }
  const populateSenseis = async () => {
    const response = await jwtAdmin.getAllSenseis()
    let banned = []

    for (let i = 0; i < response.length; i += 1) {
      if (response[i].status === 'DEACTIVATED') {
        banned = [...banned, response[i]]
      }
      // console.log('banned', banned)
    }

    setSenseis(banned)
  }

  const onButtonClick = record => {
    // console.log('button', record)
    const path = `/admin/user-management/user/${record.accountId}`
    history.push(path)
  }

  const showBannedStudent = () => {
    return (
      <Table bordered="true" dataSource={students} rowKey="accountId">
        <Column title="Account Id" dataIndex="accountId" key="accountId" />
        <Column title="First Name" dataIndex="firstName" key="firstName" />
        <Column title="Last Name" dataIndex="lastName" key="lastName" />
        <Column title="Email" dataIndex="email" key="email" />
        <Column title="Created At" dataIndex="createdAt" key="createdAt" />
        <Column title="Admin Verified" dataIndex="adminVerified" key="adminVerified" />
        <Column title="Chat Privacy" dataIndex="chatPrivacy" key="chatPrivacy" />
        <Column title="Status" dataIndex="status" key="status" />
        <Column
          title="Details"
          render={record => (
            <Button
              type="primary"
              shape="round"
              onClick={() => onButtonClick(record)}
              icon={<InfoCircleOutlined />}
            />
          )}
        />
      </Table>
    )
  }

  const showBannedSensei = () => {
    return (
      <Table bordered="true" dataSource={senseis} rowKey="accountId">
        <Column title="Account Id" dataIndex="accountId" key="accountId" />
        <Column title="First Name" dataIndex="firstName" key="firstName" />
        <Column title="Last Name" dataIndex="lastName" key="lastName" />
        <Column title="Email" dataIndex="email" key="email" />
        <Column title="Created At" dataIndex="createdAt" key="createdAt" />
        <Column title="Admin Verified" dataIndex="adminVerified" key="adminVerified" />
        <Column title="Chat Privacy" dataIndex="chatPrivacy" key="chatPrivacy" />
        <Column title="Status" dataIndex="status" key="status" />
        <Column
          title="Details"
          render={record => (
            <Button
              type="primary"
              shape="round"
              onClick={() => onButtonClick(record)}
              icon={<InfoCircleOutlined />}
            />
          )}
        />
      </Table>
    )
  }

  return (
    <div className="card">
      <div className="card-header card-header-flex">
        <div className="d-flex flex-column justify-content-center mr-auto">
          <h5>List of Banned Users</h5>
        </div>
        <Tabs activeKey={tabKey} className="kit-tabs" onChange={changeTab}>
          <TabPane tab="Banned Students" key="1" />
          <TabPane tab="Banned Senseis" key="2" />
        </Tabs>
      </div>

      <div className="card-body">
        {tabKey === '1' && showBannedStudent()}
        {tabKey === '2' && showBannedSensei()}
      </div>
    </div>
  )
}

export default BannedTable

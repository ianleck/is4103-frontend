import React, { useState, useEffect } from 'react'
import { useHistory } from 'react-router-dom'
import * as jwtAdmin from 'services/jwt/admin'
import { Tabs, Table, Button } from 'antd'
import { InfoCircleOutlined } from '@ant-design/icons'

const { TabPane } = Tabs
const { Column } = Table

const NewMentorTable = () => {
  const [tabKey, setTabKey] = useState('1')
  const changeTab = key => {
    setTabKey(key)
  }
  const [senseis, setSenseis] = useState()
  const history = useHistory()

  useEffect(() => {
    populateSenseis()
  }, [])

  const populateSenseis = async () => {
    const response = await jwtAdmin.getAllSenseis()
    let unverified = []

    for (let i = 0; i < response.length; i += 1) {
      if (response[i].adminVerified === 'PENDING') {
        unverified = [...unverified, response[i]]
      }
    }
    // console.log(unverified)
    setSenseis(unverified)
  }

  const onButtonClick = record => {
    // console.log('button', record)
    const path = `/admin/user-management/verify-senseis/${record.accountId}`
    history.push(path)
  }

  const showNewMentors = () => {
    return (
      <Table bordered="true" dataSource={senseis} rowKey="accountId">
        <Column title="Account Id" dataIndex="accountId" key="accountId" />
        <Column title="First Name" dataIndex="firstName" key="firstName" />
        <Column title="Last Name" dataIndex="lastName" key="lastName" />
        <Column title="Email" dataIndex="email" key="email" />
        <Column title="Created At" dataIndex="createdAt" key="createdAt" />
        <Column title="Admin Verified" dataIndex="adminVerified" key="adminVerified" />
        <Column title="Privacy" dataIndex="privacy" key="privacy" />
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
          <h5>List of New Senseis</h5>
        </div>
        <Tabs activeKey={tabKey} className="kit-tabs" onChange={changeTab}>
          <TabPane tab="New Senseis" key="1" />
        </Tabs>
      </div>

      <div className="card-body">{tabKey === '1' && showNewMentors()}</div>
    </div>
  )
}

export default NewMentorTable

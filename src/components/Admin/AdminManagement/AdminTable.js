import React, { useEffect, useState } from 'react'
import { useHistory } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { Button, Tabs, Table } from 'antd'
import * as jwtAdmin from 'services/jwt/admin'
import { InfoCircleOutlined } from '@ant-design/icons'

const { TabPane } = Tabs
const { Column } = Table

const AdminTable = () => {
  const [tabKey, setTabKey] = useState('1')
  const user = useSelector(state => state.user)
  const [admins, setAdmins] = useState()
  const history = useHistory()

  useEffect(() => {
    populateAdmin()
  }, [])

  const populateAdmin = async () => {
    const response = await jwtAdmin.getAllAdmins()
    setAdmins(response)
  }

  const changeTab = key => {
    setTabKey(key)
  }

  const buttonClick = record => {
    // console.log('button')
    if (user.accountId === record.accountId) {
      const path = '/admin/profile'
      history.push(path)
    } else {
      const path = `/admin/admin-management/admin/${record.accountId}`
      // console.log(path)
      history.push(path)
    }
  }

  const showAdmins = () => {
    return (
      <Table bordered="true" dataSource={admins} rowKey="accountId">
        <Column title="Account Id" dataIndex="accountId" key="accountId" />
        <Column title="First Name" dataIndex="firstName" key="firstName" />
        <Column title="Last Name" dataIndex="lastName" key="lastName" />
        <Column title="Email" dataIndex="email" key="email" />
        <Column title="Created At" dataIndex="createdAt" key="createdAt" />
        <Column title="Updated At" dataIndex="updatedAt" key="updatedAt" />
        <Column title="Permission" dataIndex="permission" key="permission" />
        <Column title="Status" dataIndex="status" key="status" />
        <Column
          title="Details"
          render={record => (
            <Button
              type="primary"
              shape="round"
              onClick={() => buttonClick(record)}
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
          <h5>List of Admins</h5>
        </div>
        <Tabs activeKey={tabKey} className="kit-tabs" onChange={changeTab}>
          <TabPane tab="Admin" key="1" />
        </Tabs>
      </div>

      <div className="card-body">{tabKey === '1' && showAdmins()}</div>
    </div>
  )
}

export default AdminTable

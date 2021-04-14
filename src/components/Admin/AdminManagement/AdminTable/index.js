import React, { useEffect, useState } from 'react'
import { useHistory } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { Button, Tabs, Table } from 'antd'
import * as jwtAdmin from 'services/admin'
import { InfoCircleOutlined } from '@ant-design/icons'
import { indexOf, isNil, map } from 'lodash'
import { formatTime } from 'components/utils'
import { ADMIN_ROLE_ENUM_FILTER } from 'constants/filters'

const { TabPane } = Tabs

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
    const listingRecords = map(response, res => ({ ...res, key: indexOf(response, res) }))
    setAdmins(listingRecords)
  }

  const changeTab = key => {
    setTabKey(key)
  }

  const buttonClick = record => {
    if (user.accountId === record.accountId) {
      const path = '/admin/profile'
      history.push(path)
    } else {
      const path = `/admin/admin-management/admin/${record.accountId}`
      history.push(path)
    }
  }

  const showAdmins = () => {
    const tableColumns = [
      {
        title: 'First Name',
        dataIndex: 'firstName',
        key: 'firstName',
        sorter: (a, b) =>
          !isNil(a.firstName) && !isNil(b.firstName) ? a.firstName.length - b.firstName.length : '',
        sortDirections: ['ascend', 'descend'],
      },
      {
        title: 'Last Name',
        dataIndex: 'lastName',
        key: 'lastName',
        responsive: ['md'],
        sorter: (a, b) =>
          !isNil(a.lastName) && !isNil(b.lastName) ? a.lastName.length - b.lastName.length : '',
        sortDirections: ['ascend', 'descend'],
      },
      {
        title: 'Email',
        dataIndex: 'email',
        key: 'email',
        responsive: ['lg'],
        sorter: (a, b) => a.email.length - b.email.length,
        sortDirections: ['ascend', 'descend'],
      },
      {
        title: 'Account ID',
        dataIndex: 'accountId',
        key: 'accountId',
        responsive: ['md'],
      },
      {
        title: 'Created At',
        dataIndex: 'createdAt',
        key: 'createdAt',
        render: createdAt => formatTime(createdAt),
      },
      {
        title: 'Updated At',
        dataIndex: 'updatedAt',
        key: 'updatedAt',
        responsive: ['lg'],
        render: updatedAt => formatTime(updatedAt),
      },
      {
        title: 'Role',
        dataIndex: 'role',
        key: 'role',
        filters: ADMIN_ROLE_ENUM_FILTER,
        onFilter: (value, record) => record.role.indexOf(value) === 0,
      },
      {
        title: 'Details',
        key: 'details',
        render: record => (
          <Button
            type="primary"
            size="large"
            shape="circle"
            onClick={() => buttonClick(record)}
            icon={<InfoCircleOutlined />}
          />
        ),
      },
    ]
    return <Table dataSource={admins} columns={tableColumns} />
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

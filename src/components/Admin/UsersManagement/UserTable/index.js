import React, { useState, useEffect } from 'react'
import { useHistory } from 'react-router-dom'
import * as jwtAdmin from 'services/admin'
import { Tabs, Table, Button } from 'antd'
import { InfoCircleOutlined } from '@ant-design/icons'
import moment from 'moment'
import { indexOf, isNil, map } from 'lodash'
import {
  ADMIN_VERIFIED_ENUM_FILTER,
  PRIVACY_PERMISSIONS_ENUM_FILTER,
  STATUS_ENUM_FILTER,
} from 'constants/filters'

const { TabPane } = Tabs

const UserTable = () => {
  const [tabKey, setTabKey] = useState('1')
  const changeTab = key => {
    setTabKey(key)
  }
  const [students, setStudents] = useState()
  const [senseis, setSenseis] = useState()
  const history = useHistory()

  useEffect(() => {
    populateStudents()
    populateSenseis()
  }, [])

  const populateStudents = async () => {
    const response = await jwtAdmin.getAllStudents()
    const listingRecords = map(response, res => ({ ...res, key: indexOf(response, res) }))
    setStudents(listingRecords)
  }
  const populateSenseis = async () => {
    const response = await jwtAdmin.getAllSenseis()
    const listingRecords = map(response, res => ({ ...res, key: indexOf(response, res) }))
    setSenseis(listingRecords)
  }

  const onButtonClick = record => {
    history.push(`/admin/user-management/profile/${record.accountId}`)
  }

  const showStudent = () => {
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
        responsive: ['lg'],
      },
      {
        title: 'Created At',
        dataIndex: 'createdAt',
        key: 'createdAt',
        render: createdAt => moment(createdAt).format('YYYY-MM-DD h:mm:ss a'),
      },
      {
        title: 'Chat Privacy',
        dataIndex: 'chatPrivacy',
        key: 'chatPrivacy',
        responsive: ['lg'],
        filters: PRIVACY_PERMISSIONS_ENUM_FILTER,
        onFilter: (value, record) => record.chatPrivacy.indexOf(value) === 0,
      },
      {
        title: 'Status',
        dataIndex: 'status',
        key: 'status',
        filters: STATUS_ENUM_FILTER,
        onFilter: (value, record) => record.chatPrivacy.indexOf(value) === 0,
      },
      {
        title: 'Details',
        key: 'details',
        render: record => (
          <Button
            type="primary"
            shape="round"
            onClick={() => onButtonClick(record)}
            icon={<InfoCircleOutlined />}
          />
        ),
      },
    ]
    return <Table dataSource={students} columns={tableColumns} />
  }

  const showSensei = () => {
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
        title: 'Admin Verified',
        dataIndex: 'adminVerified',
        key: 'adminVerified',
        filters: ADMIN_VERIFIED_ENUM_FILTER,
        onFilter: (value, record) => record.adminVerified.indexOf(value) === 0,
      },
      {
        title: 'Account ID',
        dataIndex: 'accountId',
        key: 'accountId',
        responsive: ['lg'],
      },
      {
        title: 'Created At',
        dataIndex: 'createdAt',
        key: 'createdAt',
        render: createdAt => moment(createdAt).format('YYYY-MM-DD h:mm:ss a'),
      },
      {
        title: 'Chat Privacy',
        dataIndex: 'chatPrivacy',
        key: 'chatPrivacy',
        responsive: ['lg'],
        filters: PRIVACY_PERMISSIONS_ENUM_FILTER,
        onFilter: (value, record) => record.chatPrivacy.indexOf(value) === 0,
      },
      {
        title: 'Status',
        dataIndex: 'status',
        key: 'status',
        filters: STATUS_ENUM_FILTER,
        onFilter: (value, record) => record.chatPrivacy.indexOf(value) === 0,
      },
      {
        title: 'Details',
        key: 'details',
        render: record => (
          <Button
            type="primary"
            shape="round"
            onClick={() => onButtonClick(record)}
            icon={<InfoCircleOutlined />}
          />
        ),
      },
    ]
    return <Table dataSource={senseis} columns={tableColumns} />
  }

  return (
    <div className="card">
      <div className="card-header card-header-flex">
        <div className="d-flex flex-column justify-content-center mr-auto">
          <h5>List of Users</h5>
        </div>
        <Tabs activeKey={tabKey} className="kit-tabs" onChange={changeTab}>
          <TabPane tab="Students" key="1" />
          <TabPane tab="Senseis" key="2" />
        </Tabs>
      </div>

      <div className="card-body">
        {tabKey === '1' && showStudent()}
        {tabKey === '2' && showSensei()}
      </div>
    </div>
  )
}

export default UserTable

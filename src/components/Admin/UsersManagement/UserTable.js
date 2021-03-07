import React, { useState, useEffect } from 'react'
import { useHistory } from 'react-router-dom'
import * as jwtAdmin from 'services/jwt/admin'
import { Tabs, Table, Button } from 'antd'
import { InfoCircleOutlined } from '@ant-design/icons'
import { ADMIN_VERIFIED_ENUM, PRIVACY_PERMISSIONS_ENUM, STATUS_ENUM } from 'constants/constants'
import moment from 'moment'
import { indexOf, isNil, map } from 'lodash'

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
    if (record.userType === 'STUDENT') {
      const path = `/admin/user-management/student/${record.accountId}`
      history.push(path)
    } else {
      const path = `/admin/user-management/sensei/${record.accountId}`
      history.push(path)
    }
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
        filters: [
          {
            text: PRIVACY_PERMISSIONS_ENUM.FOLLOWING_ONLY,
            value: PRIVACY_PERMISSIONS_ENUM.FOLLOWING_ONLY,
          },
          { text: PRIVACY_PERMISSIONS_ENUM.ALL, value: PRIVACY_PERMISSIONS_ENUM.ALL },
          { text: PRIVACY_PERMISSIONS_ENUM.NONE, value: PRIVACY_PERMISSIONS_ENUM.NONE },
        ],
        onFilter: (value, record) => record.chatPrivacy.indexOf(value) === 0,
      },
      {
        title: 'Status',
        dataIndex: 'status',
        key: 'status',
        filters: [
          {
            text: STATUS_ENUM.ACTIVE,
            value: STATUS_ENUM.ACTIVE,
          },
          { text: STATUS_ENUM.BANNED, value: STATUS_ENUM.BANNED },
        ],
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
    return <Table bordered="true" dataSource={students} columns={tableColumns} />
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
        filters: [
          { text: ADMIN_VERIFIED_ENUM.SHELL, value: ADMIN_VERIFIED_ENUM.SHELL },
          { text: ADMIN_VERIFIED_ENUM.PENDING, value: ADMIN_VERIFIED_ENUM.PENDING },
          { text: ADMIN_VERIFIED_ENUM.ACCEPTED, value: ADMIN_VERIFIED_ENUM.ACCEPTED },
          { text: ADMIN_VERIFIED_ENUM.REJECTED, value: ADMIN_VERIFIED_ENUM.REJECTED },
        ],
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
        filters: [
          {
            text: PRIVACY_PERMISSIONS_ENUM.FOLLOWING_ONLY,
            value: PRIVACY_PERMISSIONS_ENUM.FOLLOWING_ONLY,
          },
          { text: PRIVACY_PERMISSIONS_ENUM.ALL, value: PRIVACY_PERMISSIONS_ENUM.ALL },
          { text: PRIVACY_PERMISSIONS_ENUM.NONE, value: PRIVACY_PERMISSIONS_ENUM.NONE },
        ],
        onFilter: (value, record) => record.chatPrivacy.indexOf(value) === 0,
      },
      {
        title: 'Status',
        dataIndex: 'status',
        key: 'status',
        filters: [
          {
            text: STATUS_ENUM.ACTIVE,
            value: STATUS_ENUM.ACTIVE,
          },
          { text: STATUS_ENUM.BANNED, value: STATUS_ENUM.BANNED },
        ],
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
    return <Table bordered="true" dataSource={senseis} columns={tableColumns} />
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

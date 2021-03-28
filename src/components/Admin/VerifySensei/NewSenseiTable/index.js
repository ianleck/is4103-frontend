import React, { useState, useEffect } from 'react'
import { useHistory } from 'react-router-dom'
import * as jwtAdmin from 'services/admin'
import { Tabs, Table, Button } from 'antd'
import { InfoCircleOutlined } from '@ant-design/icons'
import moment from 'moment'
import isNil from 'lodash'
import { PRIVACY_PERMISSIONS_ENUM_FILTER, STATUS_ENUM_FILTER } from 'constants/filters'

const { TabPane } = Tabs

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
    setSenseis(unverified)
  }

  const onButtonClick = record => {
    const path = `/admin/user-management/verify-senseis/${record.accountId}`
    history.push(path)
  }

  const showNewMentors = () => {
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
        title: 'Admin Verified',
        dataIndex: 'adminVerified',
        key: 'adminVerified',
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

    return <Table bordered="true" dataSource={senseis} columns={tableColumns} />
  }

  return (
    <div className="card">
      <div className="card-header card-header-flex">
        <div className="d-flex flex-column justify-content-center mr-auto">
          <h5>List of Senseis Pending Verification</h5>
        </div>
        <Tabs activeKey={tabKey} className="kit-tabs" onChange={changeTab}>
          <TabPane tab="Pending Senseis" key="1" />
        </Tabs>
      </div>

      <div className="card-body">{tabKey === '1' && showNewMentors()}</div>
    </div>
  )
}

export default NewMentorTable

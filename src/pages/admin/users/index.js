import React, { useEffect, useState } from 'react'
import { Button, Space, Table, Tabs } from 'antd'
import { useHistory } from 'react-router-dom'
import { Helmet } from 'react-helmet'
import BannedTable from 'components/Admin/UsersManagement/BannedTable'
import { getAllSenseis, getAllStudents, acceptSensei, rejectSensei } from 'services/admin'
import {
  filterDataByAdminVerified,
  formatTime,
  showNotification,
  sortDescAndKeyAccId,
} from 'components/utils'
import UserCountIconWidget from 'components/Admin/UsersManagement/UserCountIconWidget'
import { ADMIN_VERIFIED_ENUM } from 'constants/constants'
import { ADMIN_VERIFIED_ENUM_FILTER, USER_TYPE_ENUM_FILTER } from 'constants/filters'
import { isNil } from 'lodash'
import { CheckOutlined, CloseOutlined, InfoCircleOutlined } from '@ant-design/icons'
import StatusTag from 'components/Common/StatusTag'
import {
  ACCEPT_SENSEI_PROFILE,
  ERROR,
  REJECT_SENSEI_PROFILE,
  SENSEI_PROFILE_UPDATE_ERR,
  SUCCESS,
} from 'constants/notifications'

const UsersManagement = () => {
  const { TabPane } = Tabs

  const history = useHistory()

  const [allSenseis, setAllSenseis] = useState([])
  const [pendingSenseis, setPendingSenseis] = useState([])
  const [acceptedSenseis, setAcceptedSenseis] = useState([])
  const [rejectedSenseis, setRejectedSenseis] = useState([])
  const [allStudents, setAllStudents] = useState([])
  const [allUsers, setAllUsers] = useState([])
  const [currentTab, setCurrentTab] = useState('all')
  const [currentFilter, setCurrentFilter] = useState('all')
  const [currentTableData, setCurrentTableData] = useState([])

  const tableColumns = [
    {
      title: 'First Name',
      dataIndex: 'firstName',
      key: 'firstName',
      width: '5%',
      sorter: (a, b) =>
        !isNil(a.firstName) && !isNil(b.firstName) ? a.firstName.length - b.firstName.length : '',
      sortDirections: ['ascend', 'descend'],
    },
    {
      title: 'Last Name',
      dataIndex: 'lastName',
      key: 'lastName',
      width: '5%',
      responsive: ['md'],
      sorter: (a, b) =>
        !isNil(a.lastName) && !isNil(b.lastName) ? a.lastName.length - b.lastName.length : '',
      sortDirections: ['ascend', 'descend'],
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
      width: '15%',
      responsive: ['lg'],
      sorter: (a, b) => a.email.length - b.email.length,
      sortDirections: ['ascend', 'descend'],
    },
    {
      title: 'User Type',
      dataIndex: 'userType',
      key: 'userType',
      filters: USER_TYPE_ENUM_FILTER,
      onFilter: (value, record) => record.userType.indexOf(value) === 0,
      render: record => <StatusTag data={{ userType: record }} type="USER_TYPE_ENUM" />,
    },
    {
      title: 'Admin Verified',
      dataIndex: 'adminVerified',
      key: 'adminVerified',
      filters: ADMIN_VERIFIED_ENUM_FILTER,
      onFilter: (value, record) => record.adminVerified.indexOf(value) === 0,
      render: record => <StatusTag data={{ adminVerified: record }} type="ADMIN_VERIFIED_ENUM" />,
    },
    {
      title: 'Created At',
      dataIndex: 'createdAt',
      key: 'createdAt',
      responsive: ['md'],
      render: createdAt => formatTime(createdAt),
    },
    {
      title: 'Action',
      key: 'action',
      render: record => {
        if (currentTab === 'senseis') {
          return (
            <Space size="large">
              <Button
                type="primary"
                shape="circle"
                size="large"
                icon={<InfoCircleOutlined />}
                onClick={() => redirectToUserProfile(record)}
              />
              <Button
                className="btn btn-success"
                size="large"
                shape="circle"
                icon={<CheckOutlined />}
                disabled={record.adminVerified !== ADMIN_VERIFIED_ENUM.PENDING}
                onClick={() => acceptSenseiProfile(record)}
              />
              <Button
                type="danger"
                size="large"
                shape="circle"
                icon={<CloseOutlined />}
                disabled={record.adminVerified !== ADMIN_VERIFIED_ENUM.PENDING}
                onClick={() => rejectSenseiProfile(record)}
              />
            </Space>
          )
        }
        return (
          <Button
            type="primary"
            shape="circle"
            size="large"
            icon={<InfoCircleOutlined />}
            onClick={() => redirectToUserProfile(record)}
          />
        )
      },
    },
  ]

  const switchTabs = key => {
    setCurrentTab(key)
    setCurrentFilter('all')
    switch (key) {
      case 'all':
        setCurrentTableData(allUsers)
        break
      case 'students':
        setCurrentTableData(allStudents)
        break
      case 'senseis':
        setCurrentTableData(allSenseis)
        break
      default:
        setCurrentTableData(allUsers)
        break
    }
  }

  const setTableData = filter => {
    if (currentTab === 'senseis' && currentFilter === filter) {
      setCurrentTableData(sortDescAndKeyAccId(allSenseis))
      setCurrentFilter('all')
      return
    }
    switch (filter) {
      case 'pending':
        setCurrentTableData(pendingSenseis)
        break
      case 'accepted':
        setCurrentTableData(acceptedSenseis)
        break
      case 'rejected':
        setCurrentTableData(rejectedSenseis)
        break
      default:
        if (currentTab === 'students') setCurrentTableData(allStudents)
        if (currentTab === 'all') setCurrentTableData(allUsers)
        break
    }
    setCurrentFilter(filter)
  }

  const redirectToUserProfile = record => {
    if (record.userType === 'STUDENT') {
      const path = `/admin/user-management/student/${record.accountId}`
      history.push(path)
    } else {
      const path = `/admin/user-management/sensei/${record.accountId}`
      history.push(path)
    }
  }

  const acceptSenseiProfile = async record => {
    if (record && !isNil(record.accountId)) {
      const response = await acceptSensei(record.accountId)
      if (response && !isNil(response.adminVerified)) {
        if (response.adminVerified === ADMIN_VERIFIED_ENUM.ACCEPTED) {
          retrieveAllUsers()
          showNotification('success', SUCCESS, ACCEPT_SENSEI_PROFILE)
        }
      }
    } else {
      showNotification('error', ERROR, SENSEI_PROFILE_UPDATE_ERR)
    }
  }

  const rejectSenseiProfile = async record => {
    const response = await rejectSensei(record.accountId)
    if (response) {
      if (response.adminVerified === 'REJECTED') {
        retrieveAllUsers()
        showNotification('success', SUCCESS, REJECT_SENSEI_PROFILE)
      }
    } else {
      showNotification('error', ERROR, SENSEI_PROFILE_UPDATE_ERR)
    }
  }

  const retrieveAllUsers = async () => {
    const senseis = await getAllSenseis()
    const keyAllSenseis = sortDescAndKeyAccId(senseis)
    const keyPendingSenseis = filterDataByAdminVerified(
      sortDescAndKeyAccId(senseis),
      ADMIN_VERIFIED_ENUM.PENDING,
    )
    const keyAcceptedSenseis = filterDataByAdminVerified(
      sortDescAndKeyAccId(senseis),
      ADMIN_VERIFIED_ENUM.ACCEPTED,
    )
    const keyRejectedSenseis = filterDataByAdminVerified(
      sortDescAndKeyAccId(senseis),
      ADMIN_VERIFIED_ENUM.REJECTED,
    )

    const students = await getAllStudents()
    const keyAllStudents = sortDescAndKeyAccId(students)

    const users = [...senseis, ...students]
    const keyAllUsers = sortDescAndKeyAccId(users)

    setAllSenseis(sortDescAndKeyAccId(senseis))
    setAllStudents(sortDescAndKeyAccId(students))
    setAllUsers(keyAllUsers)
    setPendingSenseis(keyPendingSenseis)
    setAcceptedSenseis(keyAcceptedSenseis)
    setRejectedSenseis(keyRejectedSenseis)

    switch (currentTab) {
      case 'all':
        setCurrentTableData(keyAllUsers)
        break
      case 'students':
        setCurrentTableData(keyAllStudents)
        break
      case 'senseis':
        if (currentFilter === 'pending') setCurrentTableData(keyPendingSenseis)
        else if (currentFilter === 'accepted') setCurrentTableData(keyAcceptedSenseis)
        else if (currentFilter === 'rejected') setCurrentTableData(keyRejectedSenseis)
        else setCurrentTableData(keyAllSenseis)
        break
      default:
        setCurrentTableData(keyAllUsers)
        break
    }
  }

  useEffect(() => {
    retrieveAllUsers()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div>
      <div className="row">
        <Helmet title="User Management" />
        <div className="col-auto">
          <div className="text-dark text-uppercase h3">
            <strong>User Management</strong>
          </div>
        </div>
      </div>

      <div className="row mt-4">
        <div className="col-12">
          <div className="card">
            <div className="card-header card-header-flex">
              <div className="d-flex flex-column justify-content-center mr-auto">
                <h5>List of Users</h5>
              </div>
              <Tabs activeKey={currentTab} className="kit-tabs" onChange={key => switchTabs(key)}>
                <TabPane tab="All" key="all" />
                <TabPane tab="Students" key="students" />
                <TabPane tab="Senseis" key="senseis" />
              </Tabs>
            </div>

            <div className="card-body">
              <UserCountIconWidget
                allUsers={allUsers}
                allSenseis={allSenseis}
                allStudents={allStudents}
                currentTab={currentTab}
                switchTabs={switchTabs}
                pendingSenseis={pendingSenseis}
                acceptedSenseis={acceptedSenseis}
                rejectedSenseis={rejectedSenseis}
                currentFilter={currentFilter}
                setTableData={setTableData}
              />
              <div className="row">
                <div className="col-12 overflow-x-scroll">
                  <Table dataSource={currentTableData} columns={tableColumns} />
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="col-12">
          <BannedTable />
        </div>
      </div>
    </div>
  )
}

export default UsersManagement

import React, { useState, useEffect } from 'react'
import * as jwtAdmin from 'services/admin'
import { Tabs, Table, Space, Button, Modal, Descriptions } from 'antd'
import { formatTime } from 'components/utils'
import { InfoCircleOutlined } from '@ant-design/icons'
import {
  CONTRACT_PROGRESS_ENUM_FILTER,
  MENTORSHIP_CONTRACT_APPROVAL_ENUM_FILTER,
} from 'constants/filters'
import { isNil } from 'lodash'
import StatusTag from 'components/Common/StatusTag'
import ApplicationsWidget from '../../../Mentorship/ApplicationsWidget'
import ContractsWidget from '../../../Mentorship/ContractsWidget'

const { TabPane } = Tabs

const MentorshipContracts = ({ id }) => {
  const userId = id
  const [tabKey, setTabKey] = useState('Applications')

  const [applications, setApplications] = useState([])
  const [contracts, setContracts] = useState([])

  const [showApplicationDetails, setShowApplicationDetails] = useState(false)
  const [applicationDetails, setApplicationDetails] = useState(false)

  const [showContractDetails, setShowContractDetails] = useState(false)
  const [contractDetails, setContractDetails] = useState(false)

  useEffect(() => {
    populateApplications()
    populateContracts()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const changeTab = key => {
    setTabKey(key)
  }

  const onCloseDetails = () => {
    setShowApplicationDetails(false)
    setShowContractDetails(false)
  }

  const selectApplication = record => {
    setShowApplicationDetails(true)
    setApplicationDetails(record)
  }

  const selectContract = record => {
    setShowContractDetails(true)
    setContractDetails(record)
  }

  const populateApplications = async () => {
    const response = await jwtAdmin.getStudentMentorshipContracts(userId)

    response.forEach(async item => {
      const Sensei = await jwtAdmin.getSensei(item.MentorshipListing.accountId)
      item.Sensei = Sensei
    })

    setApplications(response)
  }

  const populateContracts = async () => {
    const response = await jwtAdmin.getStudentMentorshipContracts(userId)

    let con = []

    for (let i = 0; i < response.length; i += 1) {
      if (response[i].senseiApproval === 'APPROVED') {
        con = [...con, response[i]]
      }
    }

    con.forEach(async item => {
      const Sensei = await jwtAdmin.getSensei(item.MentorshipListing.accountId)
      item.Sensei = Sensei
    })

    setContracts(con)
  }

  const applicationsColumns = [
    {
      title: 'Created At',
      key: 'createdAt',
      dataIndex: 'createdAt',
      width: '15%',
      responsive: ['lg'],
      render: record => formatTime(record),
      sorter: (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
      sortDirections: ['ascend', 'descend'],
    },
    {
      title: 'Mentorship Listing Name',
      key: ['MentorshipListing', 'name'],
      dataIndex: ['MentorshipListing', 'name'],
      sorter: (a, b) => a.MentorshipListing.name.length - b.MentorshipListing.name.length,
    },
    {
      title: 'Mentorship Application Statement',
      key: ['statement'],
      dataIndex: ['statement'],
      sorter: (a, b) => a.MentorshipListing.statement.length - b.MentorshipListing.statement.length,
      responsive: ['sm'],
    },
    {
      title: 'Progress',
      key: 'progress',
      dataIndex: 'progress',
      width: '15%',
      responsive: ['lg'],
      render: record => <StatusTag data={record} type="CONTRACT_PROGRESS_ENUM" />,
      filters: CONTRACT_PROGRESS_ENUM_FILTER,
      onFilter: (value, record) => record.progress.indexOf(value) === 0,
    },
    {
      title: 'Sensei Approval',
      key: 'senseiApproval',
      dataIndex: 'senseiApproval',
      width: '15%',
      render: record => <StatusTag data={record} type="MENTORSHIP_CONTRACT_APPROVAL" />,
      filters: MENTORSHIP_CONTRACT_APPROVAL_ENUM_FILTER,
      onFilter: (value, record) => record.senseiApproval.indexOf(value) === 0,
    },
    {
      title: 'Action',
      key: 'action',
      render: record => (
        <Space size="large">
          <Button
            disabled={record.isResolved}
            type="primary"
            shape="circle"
            size="large"
            onClick={() => selectApplication(record)}
            icon={<InfoCircleOutlined />}
          />
        </Space>
      ),
    },
  ]

  const showApplicationWidget = () => {
    return <ApplicationsWidget data={applications} />
  }

  const showApplications = () => {
    return (
      <Table
        dataSource={applications}
        columns={applicationsColumns}
        rowKey="mentorshipContractId"
      />
    )
  }

  const formatPass = record => {
    if (isNil(record)) {
      return 0
    }
    return record
  }

  const contractsColumns = [
    {
      title: 'Created At',
      key: 'createdAt',
      dataIndex: 'createdAt',
      width: '15%',
      responsive: ['lg'],
      render: record => formatTime(record),
      sorter: (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
      sortDirections: ['ascend', 'descend'],
    },
    {
      title: 'Mentorship Listing Name',
      key: ['MentorshipListing', 'name'],
      dataIndex: ['MentorshipListing', 'name'],
      sorter: (a, b) => a.MentorshipListing.name.length - b.MentorshipListing.name.length,
      width: '15%',
    },
    {
      title: 'Mentorship Listing Description',
      key: ['MentorshipListing', 'description'],
      dataIndex: ['MentorshipListing', 'description'],
      sorter: (a, b) =>
        a.MentorshipListing.description.length - b.MentorshipListing.description.length,
      responsive: ['sm'],
    },
    {
      title: 'Mentorship Pass Count',
      key: ['mentorshipPassCount'],
      dataIndex: ['mentorshipPassCount'],
      width: '15%',
      render: record => formatPass(record),
      responsive: ['md'],
    },
    {
      title: 'Progress',
      key: 'progress',
      dataIndex: 'progress',
      width: '15%',
      render: record => <StatusTag data={record} type="CONTRACT_PROGRESS_ENUM" />,
      filters: CONTRACT_PROGRESS_ENUM_FILTER,
      onFilter: (value, record) => record.progress.indexOf(value) === 0,
    },
    {
      title: 'Sensei Approval',
      key: 'senseiApproval',
      dataIndex: 'senseiApproval',
      width: '15%',
      render: record => <StatusTag data={record} type="MENTORSHIP_CONTRACT_APPROVAL" />,
      filters: MENTORSHIP_CONTRACT_APPROVAL_ENUM_FILTER,
      onFilter: (value, record) => record.senseiApproval.indexOf(value) === 0,
    },
    {
      title: 'Action',
      key: 'action',
      render: record => (
        <Space size="large">
          <Button
            disabled={record.isResolved}
            type="primary"
            shape="circle"
            size="large"
            onClick={() => selectContract(record)}
            icon={<InfoCircleOutlined />}
          />
        </Space>
      ),
    },
  ]

  const showContractWidget = () => {
    return <ContractsWidget data={contracts} />
  }

  const showContracts = () => {
    return <Table dataSource={contracts} columns={contractsColumns} rowKey="mentorshipContractId" />
  }

  return (
    <div className="card">
      <div className="card-header card-header-flex">
        <div className="d-flex flex-column justify-content-center mr-auto">
          <h5>Mentorship</h5>
        </div>
        <Tabs activeKey={tabKey} className="kit-tabs" onChange={changeTab}>
          <TabPane tab="Applications" key="Applications" />
          <TabPane tab="Contracts" key="Contracts" />
        </Tabs>
      </div>

      <div className="card-body">
        {tabKey === 'Applications' && showApplicationWidget()}
        {tabKey === 'Contracts' && showContractWidget()}

        <div className="row">
          <div className="col-12 overflow-x-scroll">
            {tabKey === 'Applications' && showApplications()}
            {tabKey === 'Contracts' && showContracts()}
          </div>
        </div>
      </div>

      <div className="col-xl-4 col-lg-12">
        <Modal
          title="Mentorship Application Details"
          visible={showApplicationDetails}
          cancelText="Close"
          centered
          okButtonProps={{ style: { display: 'none' } }}
          onCancel={() => onCloseDetails()}
        >
          <Descriptions column={1}>
            <Descriptions.Item label="Mentorship Contract ID">
              {applicationDetails.mentorshipContractId}
            </Descriptions.Item>
            <Descriptions.Item label="Mentorship Application Statement">
              {applicationDetails.statement}
            </Descriptions.Item>
            <Descriptions.Item label="Listing ID">
              {applicationDetails.mentorshipListingId}
            </Descriptions.Item>
            <Descriptions.Item label="Name">
              {applicationDetails ? applicationDetails.MentorshipListing.name : '-'}
            </Descriptions.Item>
            <Descriptions.Item label="Description">
              {applicationDetails ? applicationDetails.MentorshipListing.description : '-'}
            </Descriptions.Item>
            <Descriptions.Item label="Pass price">
              {applicationDetails ? applicationDetails.MentorshipListing.priceAmount : '-'}
            </Descriptions.Item>
            <Descriptions.Item label="Date Created">
              {applicationDetails.createdAt ? formatTime(applicationDetails.createdAt) : '-'}
            </Descriptions.Item>
            <Descriptions.Item label="Date Updated">
              {applicationDetails.updatedAt ? formatTime(applicationDetails.updatedAt) : '-'}
            </Descriptions.Item>
            <Descriptions.Item label="Progress">
              {applicationDetails.progress ? (
                <StatusTag data={applicationDetails.progress} type="CONTRACT_PROGRESS_ENUM" />
              ) : (
                '-'
              )}
            </Descriptions.Item>
            <Descriptions.Item label="Sensei Approval">
              {applicationDetails.senseiApproval ? (
                <StatusTag
                  data={applicationDetails.senseiApproval}
                  type="MENTORSHIP_CONTRACT_APPROVAL"
                />
              ) : (
                '-'
              )}
            </Descriptions.Item>
          </Descriptions>
        </Modal>
      </div>

      <div className="col-xl-4 col-lg-12">
        <Modal
          title="Mentorship Contract Details"
          visible={showContractDetails}
          cancelText="Close"
          centered
          okButtonProps={{ style: { display: 'none' } }}
          onCancel={() => onCloseDetails()}
        >
          <Descriptions column={1}>
            <Descriptions.Item label="Mentorship Contract ID">
              {contractDetails.mentorshipContractId}
            </Descriptions.Item>
            <Descriptions.Item label="Listing ID">
              {contractDetails.mentorshipListingId}
            </Descriptions.Item>
            <Descriptions.Item label="Name">
              {contractDetails ? contractDetails.MentorshipListing.name : '-'}
            </Descriptions.Item>
            <Descriptions.Item label="Description">
              {contractDetails ? contractDetails.MentorshipListing.description : '-'}
            </Descriptions.Item>
            <Descriptions.Item label="Sensei">
              {contractDetails.Sensei
                ? `${contractDetails.Sensei.firstName} ${contractDetails.Sensei.lastName}`
                : null}
            </Descriptions.Item>
            <Descriptions.Item label="Pass price">
              {contractDetails ? contractDetails.MentorshipListing.priceAmount : '-'}
            </Descriptions.Item>
            <Descriptions.Item label="Date Created">
              {contractDetails.createdAt ? formatTime(contractDetails.createdAt) : '-'}
            </Descriptions.Item>
            <Descriptions.Item label="Date Updated">
              {contractDetails.updatedAt ? formatTime(contractDetails.updatedAt) : '-'}
            </Descriptions.Item>
            <Descriptions.Item label="Progress">
              {contractDetails.progress ? (
                <StatusTag data={contractDetails.progress} type="CONTRACT_PROGRESS_ENUM" />
              ) : (
                '-'
              )}
            </Descriptions.Item>
            <Descriptions.Item label="Sensei Approval">
              {contractDetails.senseiApproval ? (
                <StatusTag
                  data={contractDetails.senseiApproval}
                  type="MENTORSHIP_CONTRACT_APPROVAL"
                />
              ) : (
                '-'
              )}
            </Descriptions.Item>
          </Descriptions>
        </Modal>
      </div>
    </div>
  )
}

export default MentorshipContracts

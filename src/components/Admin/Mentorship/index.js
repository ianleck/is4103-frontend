import React, { useState, useEffect } from 'react'
import { useSelector } from 'react-redux'
import { useHistory } from 'react-router-dom'
import * as jwtAdmin from 'services/admin'
import { getMentorshipListing } from 'services/mentorship/listings'
import { Tabs, Table, Space, Button, Tag, Modal, Descriptions } from 'antd'
import { formatTime } from 'components/utils'
import { InfoCircleOutlined } from '@ant-design/icons'
import {
  CONTRACT_PROGRESS_ENUM_FILTER,
  MENTORSHIP_CONTRACT_APPROVAL_ENUM_FILTER,
  VISIBILITY_ENUM_FILTER,
} from 'constants/filters'
import StatusTag from 'components/Common/StatusTag'
import Paragraph from 'antd/lib/typography/Paragraph'
import { compact, isEmpty, map } from 'lodash'
import ListingsWidget from './ListingsWidget'
import ApplicationsWidget from './ApplicationsWidget'
import ContractsWidget from './ContractsWidget'

const { TabPane } = Tabs

const Mentorship = () => {
  const history = useHistory()
  const [tabKey, setTabKey] = useState('Listings')
  const categories = useSelector(state => state.categories)
  const categoryFilters = map(categories, cat => ({ value: cat.categoryId, text: cat.name }))

  const [listings, setListings] = useState()
  const [applications, setApplications] = useState()
  const [contracts, setContracts] = useState()

  const [showApplicationDetails, setShowApplicationDetails] = useState(false)
  const [applicationDetails, setApplicationDetails] = useState(false)

  const [showContractDetails, setShowContractDetails] = useState(false)
  const [contractDetails, setContractDetails] = useState(false)

  useEffect(() => {
    populateListings()
    populateApplications()
    populateContracts()
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

  const populateListings = async () => {
    const response = await jwtAdmin.getAllMentorshipListings()
    setListings(response)
  }

  const populateApplications = async () => {
    const response = await jwtAdmin.getAllMentorshipContracts()

    response.forEach(async item => {
      const Student = await jwtAdmin.getStudent(item.accountId)
      item.Student = Student

      const MentorshipListing = await getMentorshipListing(item.mentorshipListingId)
      item.MentorshipListing = MentorshipListing.mentorshipListing

      const Sensei = await jwtAdmin.getSensei(item.MentorshipListing.accountId)
      item.Sensei = Sensei
    })

    setApplications(response)
  }

  const populateContracts = async () => {
    const response = await jwtAdmin.getAllMentorshipContracts()

    let con = []

    for (let i = 0; i < response.length; i += 1) {
      if (response[i].senseiApproval === 'APPROVED') {
        con = [...con, response[i]]
      }
    }

    con.forEach(async item => {
      const Student = await jwtAdmin.getStudent(item.accountId)
      item.Student = Student

      const MentorshipListing = await getMentorshipListing(item.mentorshipListingId)
      item.MentorshipListing = MentorshipListing.mentorshipListing

      const Sensei = await jwtAdmin.getSensei(item.MentorshipListing.accountId)
      item.Sensei = Sensei
    })

    setContracts(con)
  }

  const formatName = record => {
    const name = `${record.firstName} ${record.lastName}`
    return name
  }

  const listingColumns = [
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
      dataIndex: ['name'],
      key: ['name'],
      sorter: (a, b) => a.name.length - b.name.length,
      sortDirections: ['ascend', 'descend'],
    },
    {
      title: 'Description',
      dataIndex: ['description'],
      key: ['description'],
      responsive: ['lg'],
      width: '15%',
      render: record => {
        return (
          <Paragraph ellipsis={{ rows: 1, expandable: true, symbol: 'More' }}> {record} </Paragraph>
        )
      },
    },
    {
      title: 'Sensei',
      dataIndex: ['Sensei'],
      key: ['Sensei'],
      responsive: ['md'],
      render: record => formatName(record),
      width: '15%',
    },
    {
      title: 'Categories',
      key: 'Categories',
      dataIndex: 'Categories',
      responsive: ['sm'],
      render: recordCategories => (
        <>
          {recordCategories.map(category => {
            const { name, categoryId } = category
            return (
              <Tag color="geekblue" key={categoryId}>
                {name}
              </Tag>
            )
          })}
        </>
      ),
      filters: categoryFilters,
      onFilter: (value, record) => {
        return !isEmpty(compact(record.Categories.map(c => c.categoryId.indexOf(value) === 0)))
      },
    },
    {
      title: 'Visibility',
      dataIndex: ['visibility'],
      key: ['visibility'],
      responsive: ['lg'],
      width: '10%',
      filters: VISIBILITY_ENUM_FILTER,
      onFilter: (value, record) => record.visibility.indexOf(value) === 0,
    },
    {
      title: 'Action',
      key: 'action',
      render: record => (
        <Space size="large">
          <Button
            type="primary"
            shape="circle"
            size="large"
            onClick={() =>
              history.push(
                `/admin/mentorship-content-management/view/${record.mentorshipListingId}`,
              )
            }
            icon={<InfoCircleOutlined />}
          />
        </Space>
      ),
    },
  ]

  const showListingWidget = () => {
    return <ListingsWidget />
  }

  const showListings = () => {
    return <Table dataSource={listings} columns={listingColumns} rowKey="mentorshipListingId" />
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
      width: '15%',
      responsive: ['sm'],
    },
    {
      title: 'Sensei',
      key: ['Sensei'],
      dataIndex: ['Sensei'],
      responsive: ['md'],
      render: record => formatName(record),
    },
    {
      title: 'Student',
      key: ['Student'],
      dataIndex: ['Student'],
      render: record => formatName(record),
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
      responsive: ['sm'],
    },
    {
      title: 'Sensei',
      key: ['Sensei'],
      dataIndex: ['Sensei'],
      responsive: ['md'],
      render: record => formatName(record),
    },
    {
      title: 'Student',
      key: ['Student'],
      dataIndex: ['Student'],
      render: record => formatName(record),
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
          <TabPane tab="Listings" key="Listings" />
          <TabPane tab="Applications" key="Applications" />
          <TabPane tab="Contracts" key="Contracts" />
        </Tabs>
      </div>

      <div className="card-body">
        {tabKey === 'Listings' && showListingWidget()}
        {tabKey === 'Applications' && showApplicationWidget()}
        {tabKey === 'Contracts' && showContractWidget()}

        <div className="row">
          <div className="col-12 overflow-x-scroll">
            {tabKey === 'Listings' && showListings()}
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
              <Paragraph ellipsis={{ rows: 1, expandable: true, symbol: 'More' }}>
                {applicationDetails.statement}
              </Paragraph>
            </Descriptions.Item>
            <Descriptions.Item label="Listing ID">
              {applicationDetails.mentorshipListingId}
            </Descriptions.Item>
            <Descriptions.Item label="Name">
              {applicationDetails ? applicationDetails.MentorshipListing.name : '-'}
            </Descriptions.Item>
            <Descriptions.Item label="Description">
              <Paragraph ellipsis={{ rows: 1, expandable: true, symbol: 'More' }}>
                {applicationDetails ? applicationDetails.MentorshipListing.description : '-'}
              </Paragraph>
            </Descriptions.Item>
            <Descriptions.Item label="Sensei">
              {applicationDetails.Sensei
                ? `${applicationDetails.Sensei.firstName} ${applicationDetails.Sensei.lastName}`
                : null}
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
              <Paragraph ellipsis={{ rows: 1, expandable: true, symbol: 'More' }}>
                {contractDetails ? contractDetails.MentorshipListing.description : '-'}
              </Paragraph>
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

export default Mentorship

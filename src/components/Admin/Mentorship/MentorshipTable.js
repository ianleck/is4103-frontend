import React, { useState, useEffect } from 'react'
import * as jwtAdmin from 'services/jwt/admin'
import { Tabs, Table } from 'antd'

const { TabPane } = Tabs
const { Column } = Table

const MentorshipTable = () => {
  const [tabKey, setTabKey] = useState('1')
  const changeTab = key => {
    setTabKey(key)
  }

  const [listings, setListings] = useState()
  const [applications, setApplications] = useState()
  const [contracts, setContracts] = useState()

  useEffect(() => {
    populateListings()
    populateApplications()
    populateContracts()
  }, [])

  const populateListings = async () => {
    const response = await jwtAdmin.getAllMentorshipListings()
    setListings(response)
  }

  const populateApplications = async () => {
    const response = await jwtAdmin.getAllMentorshipContracts()
    let app = []

    for (let i = 0; i < response.length; i += 1) {
      if (response[i].senseiApproval === 'PENDING') {
        app = [...app, response[i]]
      }
    }

    setApplications(app)
  }

  const populateContracts = async () => {
    const response = await jwtAdmin.getAllMentorshipContracts()

    let con = []

    for (let i = 0; i < response.length; i += 1) {
      if (response[i].senseiApproval === 'ACCEPTED') {
        con = [...con, response[i]]
      }
    }

    setContracts(con)
  }

  const showListings = () => {
    return (
      <Table bordered="true" dataSource={listings} rowKey="accountId">
        <Column
          title="Mentorship Listing Id"
          dataIndex="mentorshipListingId"
          key="mentorshipListingId"
        />
        <Column title="Name" dataIndex="name" key="name" />
        <Column title="Description" dataIndex="description" key="description" />
        <Column title="Rating" dataIndex="rating" key="rating" />
        <Column title="Owner Id" dataIndex="accountId" key="accountId" />
        <Column title="Created At" dataIndex="createdAt" key="createdAt" />
        <Column title="Updated At" dataIndex="updatedAt" key="updatedAt" />
      </Table>
    )
  }

  const showApplications = () => {
    return (
      <Table bordered="true" dataSource={applications} rowKey="accountId">
        <Column
          title="Mentorship Contract Id"
          dataIndex="mentorshipContractId"
          key="mentorshipContractId"
        />
        <Column
          title="Mentorship Listing Id"
          dataIndex="mentorshipListingId"
          key="mentorshipListingId"
        />
        <Column title="Name" dataIndex="name" key="name" />
        <Column title="Statement" dataIndex="statement" key="statement" />
        <Column title="Rating" dataIndex="rating" key="rating" />
        <Column title="Owner Id" dataIndex="accountId" key="accountId" />
        <Column title="Created At" dataIndex="createdAt" key="createdAt" />
        <Column title="Updated At" dataIndex="updatedAt" key="updatedAt" />
      </Table>
    )
  }

  const showContracts = () => {
    return (
      <Table bordered="true" dataSource={contracts} rowKey="accountId">
        <Column
          title="Mentorship Contract Id"
          dataIndex="mentorshipContractId"
          key="mentorshipContractId"
        />
        <Column
          title="Mentorship Listing Id"
          dataIndex="mentorshipListingId"
          key="mentorshipListingId"
        />
        <Column title="Name" dataIndex="name" key="name" />
        <Column title="Statement" dataIndex="statement" key="statement" />
        <Column title="Rating" dataIndex="rating" key="rating" />
        <Column title="Owner Id" dataIndex="accountId" key="accountId" />
        <Column title="Created At" dataIndex="createdAt" key="createdAt" />
        <Column title="Updated At" dataIndex="updatedAt" key="updatedAt" />
      </Table>
    )
  }

  return (
    <div className="card">
      <div className="card-header card-header-flex">
        <div className="d-flex flex-column justify-content-center mr-auto">
          <h5>Mentorship</h5>
        </div>
        <Tabs activeKey={tabKey} className="kit-tabs" onChange={changeTab}>
          <TabPane tab="Listings" key="1" />
          <TabPane tab="Applications" key="2" />
          <TabPane tab="Contracts" key="3" />
        </Tabs>
      </div>

      <div className="card-body">
        {tabKey === '1' && showListings()}
        {tabKey === '2' && showApplications()}
        {tabKey === '3' && showContracts()}
      </div>
    </div>
  )
}

export default MentorshipTable

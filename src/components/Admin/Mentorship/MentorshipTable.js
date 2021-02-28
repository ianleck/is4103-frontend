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
  const [contracts, setContracts] = useState()

  useEffect(() => {
    populateListings()
    populateContracts()
  }, [])

  const populateListings = async () => {
    const response = await jwtAdmin.getAllMentorshipListings()
    setListings(response)
  }

  const populateContracts = async () => {
    const response = await jwtAdmin.getAllMentorshipContracts()
    setContracts(response)
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
        <Column title="Deleted At" dataIndex="deletedAt" key="deletedAt" />
      </Table>
    )
  }

  const showApplications = () => {
    return <div>Mentorship Application Chart</div>
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
        <Column title="Description" dataIndex="description" key="description" />
        <Column title="Rating" dataIndex="rating" key="rating" />
        <Column title="Owner Id" dataIndex="accountId" key="accountId" />
        <Column title="Created At" dataIndex="createdAt" key="createdAt" />
        <Column title="Updated At" dataIndex="updatedAt" key="updatedAt" />
        <Column title="Deleted At" dataIndex="deletedAt" key="deletedAt" />
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

import { Table, Tabs } from 'antd'
import { BILLINGS, BILLING_MGT } from 'constants/text'
import React, { useEffect, useState } from 'react'
import { Helmet } from 'react-helmet'
import BillingCountIconWidget from './BillingCountIconWidget'

const BillingManagement = ({ allReceived, allSent, tableColumns, allBillings }) => {
  const { TabPane } = Tabs
  const [currentTab, setCurrentTab] = useState('all')
  const [currentTableData, setCurrentTableData] = useState([])

  const switchTabs = key => {
    setCurrentTab(key)
    if (key === 'received') {
      setCurrentTableData(allReceived)
    }
    if (key === 'sent') {
      setCurrentTableData(allSent)
    }
    if (key === 'all') {
      setCurrentTableData(allBillings)
    }
  }

  useEffect(() => {
    setCurrentTableData(allBillings)
  }, [allBillings])

  return (
    <div>
      <div className="row">
        <Helmet title={BILLING_MGT} />
        <div className="col-auto">
          <div className="text-dark text-uppercase h3">
            <strong>{BILLING_MGT}</strong>
          </div>
        </div>
      </div>

      <div className="row mt-4">
        <div className="col-12">
          <div className="card">
            <div className="card-header card-header-flex">
              <div className="d-flex flex-column justify-content-center mr-auto">
                <h5>List of {BILLINGS}</h5>
              </div>
              <Tabs activeKey={currentTab} className="kit-tabs" onChange={key => switchTabs(key)}>
                <TabPane tab="All" key="all" />
                <TabPane tab="Received" key="received" />
                <TabPane tab="Sent" key="sent" />
              </Tabs>
            </div>

            <div className="card-body">
              <BillingCountIconWidget
                allSent={allSent}
                allReceived={allReceived}
                allBillings={allBillings}
                switchTabs={switchTabs}
                objectType={BILLINGS}
              />
              <div className="row">
                <div className="col-12 overflow-x-scroll">
                  <Table dataSource={currentTableData} columns={tableColumns} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default BillingManagement

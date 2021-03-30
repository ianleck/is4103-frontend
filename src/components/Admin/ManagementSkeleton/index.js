import React from 'react'
import { Helmet } from 'react-helmet'
import { Table, Tabs } from 'antd'
import CountIconWidgetGroup from 'components/Common/CountIconWidgetGroup'

const ManagementSkeleton = ({
  currentFilter,
  currentTableData,
  handleAcceptedWidgetOnClick,
  handlePendingWidgetOnClick,
  handleRejectedWidgetOnClick,
  numAcceptedRequests,
  numPendingRequests,
  numRejectedRequests,
  objectType,
  pageTitle,
  tableColumns,
}) => {
  const { TabPane } = Tabs
  return (
    <div>
      <div className="row">
        <Helmet title={pageTitle} />
        <div className="col-auto">
          <div className="text-dark text-uppercase h3">
            <strong>{pageTitle}</strong>
          </div>
        </div>
      </div>

      <CountIconWidgetGroup
        objectType={objectType}
        currentFilter={currentFilter}
        numAccepted={numAcceptedRequests}
        numPending={numPendingRequests}
        numRejected={numRejectedRequests}
        handleAcceptedWidgetOnClick={handleAcceptedWidgetOnClick}
        handlePendingWidgetOnClick={handlePendingWidgetOnClick}
        handleRejectedWidgetOnClick={handleRejectedWidgetOnClick}
      />

      <div className="row mt-2">
        <div className="col-12">
          <div className="card">
            <div className="card-header card-header-flex">
              <div className="d-flex flex-column justify-content-center mr-auto">
                <h5>{`List of ${objectType}`}</h5>
              </div>
              <Tabs activeKey={objectType} className="kit-tabs">
                <TabPane tab={objectType} key={objectType} />
              </Tabs>
            </div>
            <div className="card-body overflow-x-scroll mr-3 mr-sm-0">
              <Table className="w-100" dataSource={currentTableData} columns={tableColumns} />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ManagementSkeleton

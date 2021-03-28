import { CheckOutlined, CloseOutlined, ExceptionOutlined } from '@ant-design/icons'
import { Table, Tabs } from 'antd'
import CountIconWidget from 'components/Common/CountIconWidget'
import React from 'react'
import { Helmet } from 'react-helmet'

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

      <div className="row mt-4">
        <div className="col-12 col-md-4">
          <CountIconWidget
            title={`Pending ${objectType}`}
            className={`${currentFilter === 'pending' ? 'btn btn-light' : 'btn'}`}
            count={numPendingRequests}
            icon={<ExceptionOutlined />}
            onClick={handlePendingWidgetOnClick}
            color="orange"
          />
        </div>

        <div className="col-6 col-md-4">
          <CountIconWidget
            title={`Accepted ${objectType}`}
            className={`${currentFilter === 'accepted' ? 'btn btn-light' : 'btn'}`}
            count={numAcceptedRequests}
            icon={<CheckOutlined />}
            onClick={handleAcceptedWidgetOnClick}
            color="green"
          />
        </div>

        <div className="col-6 col-md-4">
          <CountIconWidget
            title={`Rejected ${objectType}`}
            className={`${currentFilter === 'rejected' ? 'btn btn-light' : 'btn'}`}
            count={numRejectedRequests}
            icon={<CloseOutlined />}
            onClick={handleRejectedWidgetOnClick}
            color="red"
          />
        </div>

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

import { InfoCircleOutlined } from '@ant-design/icons'
import { Button, Table, Tabs } from 'antd'
import { WALLET_MGT } from 'constants/text'
import React from 'react'
import { Helmet } from 'react-helmet'
import { useHistory } from 'react-router-dom'

const WalletManagement = () => {
  const { TabPane } = Tabs
  const history = useHistory()

  const onButtonClick = record => {
    const path = `/admin/user-management/sensei/${record.accountId}`
    history.push(path)
  }
  const currentTableData = []
  const tableColumns = [
    {
      title: 'Wallet Id',
      key: 'walletId',
      dataIndex: 'walletId',
      width: '15%',
      responsive: ['lg'],
    },
    {
      title: 'Account Id',
      dataIndex: 'accountId',
      key: 'accountId',
    },
    {
      title: 'Pending Amount',
      dataIndex: 'pendingAmount',
      key: 'pendingAmount',
      render: record => record.toFixed(2),
      sorter: (a, b) => a.pendingAmount - b.pendingAmount,
      sortDirections: ['ascend', 'descend'],
    },
    {
      title: 'Confirmed Amount',
      dataIndex: 'confirmedAmount',
      key: 'confirmedAmount',
      render: record => record.toFixed(2),
      sorter: (a, b) => a.confirmedAmount - b.confirmedAmount,
      sortDirections: ['ascend', 'descend'],
    },
    {
      title: 'Total Amount Earned',
      dataIndex: 'totalEarned',
      key: 'totalEarned',
      render: record => record.toFixed(2),
      sorter: (a, b) => a.totalEarned - b.totalEarned,
      sortDirections: ['ascend', 'descend'],
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
  return (
    <div>
      <div className="row">
        <Helmet title={WALLET_MGT} />
        <div className="col-auto">
          <div className="text-dark text-uppercase h3">
            <strong>{WALLET_MGT}</strong>
          </div>
        </div>
      </div>
      <div className="row mt-4">
        <div className="col-12">
          <div className="card">
            <div className="card-header card-header-flex">
              <div className="d-flex flex-column justify-content-center mr-auto">
                <h5>List of Sensei Wallets</h5>
              </div>
              <Tabs activeKey="wallets" className="kit-tabs">
                <TabPane tab="Wallets" key="wallets" />
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

export default WalletManagement

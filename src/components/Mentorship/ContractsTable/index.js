import {
  CloseOutlined,
  EyeOutlined,
  QuestionCircleOutlined,
  ShoppingOutlined,
} from '@ant-design/icons'
import {
  Button,
  ConfigProvider,
  Empty,
  Popconfirm,
  Space,
  Table,
  Tabs,
  Modal,
  Form,
  Divider,
  InputNumber,
  Descriptions,
} from 'antd'
import { filter, isNil, size } from 'lodash'
import React, { useState, useEffect } from 'react'
import { useHistory } from 'react-router-dom'
import { CONTRACT_PROGRESS_ENUM } from 'constants/constants'
import { getAllStudentMentorshipApplications } from 'services/mentorship/applications'
import { useSelector, useDispatch } from 'react-redux'
import { formatTime, onFinishFailed, showNotification } from 'components/utils'
import { terminateMentorshipContract } from 'services/mentorship/subscription'
import {
  CONTRACT_CANCEL_ERR,
  CONTRACT_CANCEL_SUCCESS,
  ERROR,
  SUCCESS,
} from 'constants/notifications'

const MentorshipContractsTable = () => {
  const { TabPane } = Tabs
  const history = useHistory()
  const user = useSelector(state => state.user)
  const cart = useSelector(state => state.cart)
  const dispatch = useDispatch()

  const [tabKey, setTabKey] = useState('ongoing')
  const [mentorshipContracts, setContracts] = useState([])
  const [showBuyPass, setShowBuyPass] = useState(false)
  const [selectedRecord, setSelectedRecord] = useState([])

  const getContracts = async () => {
    const test = await getAllStudentMentorshipApplications(user.accountId)
    if (test) {
      // in order to filter M subscriptions instead of M applications
      const contracts = test.contracts.filter(c => c.senseiApproval === 'APPROVED')
      setContracts(contracts)
    }
  }

  useEffect(() => {
    getContracts()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user.accountId])
  const changeTab = key => {
    setTabKey(key)
  }

  const viewListing = listing => {
    history.push({
      pathname: `/student/dashboard/mentorship/contract/${listing.mentorshipContractId}`,
    })
  }

  const onCancelContract = async record => {
    const response = await terminateMentorshipContract({
      mentorshipContractId: record.mentorshipContractId,
      action: CONTRACT_PROGRESS_ENUM.CANCELLED,
    })

    if (response) {
      showNotification('success', SUCCESS, CONTRACT_CANCEL_SUCCESS)
      getContracts()
      changeTab('cancelled')
    } else {
      showNotification('error', ERROR, CONTRACT_CANCEL_ERR)
    }
  }

  const tableColumns = [
    {
      title: 'Mentorship Contract ID',
      dataIndex: 'mentorshipContractId',
      key: 'mentorshipContractId',
      width: '15%',
    },
    {
      title: 'Date Applied',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: record => formatTime(record),
      responsive: ['sm'],
      width: '15%',
    },
    {
      title: 'Mentorship Title',
      dataIndex: ['MentorshipListing', 'name'],
      key: ['MentorshipListing', 'name'],
      responsive: ['md'],
      sorter: (a, b) => a.name.length - b.name.length,
      sortDirections: ['ascend', 'descend'],
    },
    {
      title: 'Mentorship Description',
      dataIndex: ['MentorshipListing', 'description'],
      key: ['MentorshipListing', 'description'],
      responsive: ['lg'],
      sorter: (a, b) => a.name.length - b.name.length,
      sortDirections: ['ascend', 'descend'],
    },
    {
      title: 'Pass Price (S$)',
      dataIndex: 'MentorshipListing',
      key: 'price',
      responsive: ['lg'],
      width: '10%',
      render: record => record.priceAmount.toFixed(2),
      sorter: (a, b) => a.price - b.price,
      sortDirections: ['ascend', 'descend'],
    },
    {
      title: 'Mentor Pass Count',
      dataIndex: 'mentorPassCount',
      key: 'mentorPassCount',
      responsive: ['sm'],
      width: '10%',
      sorter: (a, b) => a.mentorPassCount - b.mentorPassCount,
      sortDirections: ['ascend', 'descend'],
      render: record => {
        return record || '-'
      },
    },
    {
      title: 'Action',
      key: 'action',
      render: record => (
        <Space size="large">
          <Button
            type="default"
            shape="circle"
            size="large"
            icon={<EyeOutlined />}
            onClick={() => viewListing(record)}
          />
          {(record.progress === CONTRACT_PROGRESS_ENUM.ONGOING ||
            record.progress === CONTRACT_PROGRESS_ENUM.NOT_STARTED) && (
            <Button
              type="primary"
              shape="circle"
              size="large"
              onClick={() => recordSelected(record)}
              icon={<ShoppingOutlined />}
            />
          )}
          {(record.progress === CONTRACT_PROGRESS_ENUM.ONGOING ||
            record.progress === CONTRACT_PROGRESS_ENUM.NOT_STARTED) && (
            <Popconfirm
              title="Are you sure you wish to cancel your subscription?"
              icon={<QuestionCircleOutlined className="text-danger" />}
              onConfirm={() => onCancelContract(record)}
            >
              <Button type="danger" shape="circle" size="large" icon={<CloseOutlined />} />
            </Popconfirm>
          )}
        </Space>
      ),
    },
  ]

  const recordSelected = record => {
    setSelectedRecord(record)
    setShowBuyPass(true)
  }

  const checkInCart = listingId => {
    for (let i = 0; i < cart.MentorPasses.length; i += 1) {
      if (cart.MentorPasses[i].mentorshipListingId === listingId) {
        return true
      }
    }
    return false
  }

  const onAddPassToCart = values => {
    const { mentorshipContractId } = selectedRecord
    const { mentorshipListingId } = selectedRecord
    const { numSlots } = values
    const { cartId } = cart

    const alrInCart = checkInCart(selectedRecord.mentorshipListingId)

    if (alrInCart) {
      dispatch({
        type: 'cart/UPDATE_MENTORSHIP_PASSES_TO_CART',
        payload: { cartId, mentorshipListingId, numSlots },
      })
    } else {
      dispatch({
        type: 'cart/ADD_MENTORSHIP_PASSES_TO_CART',
        payload: { mentorshipContractId, numSlots },
      })
    }
    setShowBuyPass(false)
  }

  const buyPassFooter = (
    <div className="row justify-content-between">
      <div className="col-auto">
        <Button type="default" size="large" onClick={() => setShowBuyPass(false)}>
          Cancel
        </Button>
      </div>
      <div className="col-auto">
        <Button type="primary" form="buyPassesForm" htmlType="submit" size="large">
          Add mentor passes to cart
        </Button>
      </div>
    </div>
  )

  const showContracts = (subscriptionStatus, dataSource, columns) => {
    const numSubscriptions = size(dataSource)
    const isRenderEmpty = numSubscriptions === 0

    const customizeRenderEmpty = () => (
      <div className="text-center">
        <Empty />
      </div>
    )
    const renderStyledStatus = status => {
      let textStyle = ''
      if (status === CONTRACT_PROGRESS_ENUM.CANCELLED) {
        textStyle = 'text-danger'
      }
      if (status === (CONTRACT_PROGRESS_ENUM.ONGOING || CONTRACT_PROGRESS_ENUM.COMPLETED)) {
        textStyle = 'text-success'
      }
      return <span className={`${textStyle} font-weight-bold`}>{status.toLowerCase()}</span>
    }
    return (
      <div>
        <div className="row justify-content-between align-items-center mt-2">
          {subscriptionStatus !== CONTRACT_PROGRESS_ENUM.NOT_STARTED && (
            <div className="col-auto">
              You currently have {numSubscriptions} {renderStyledStatus(subscriptionStatus)}{' '}
              mentorship {numSubscriptions === 1 ? 'subscription' : 'subscriptions'}.
            </div>
          )}
        </div>
        <ConfigProvider renderEmpty={isRenderEmpty && customizeRenderEmpty}>
          <Table
            className="mt-4"
            dataSource={dataSource}
            columns={columns}
            rowKey="mentorshipContractId"
          />
        </ConfigProvider>
      </div>
    )
  }

  return (
    <div className="card">
      <div className="card-header card-header-flex overflow-x-scroll">
        <div className="col-auto mt-4 justify-content-center mr-auto">
          <h5 className="mb-0">Mentorship Contracts</h5>
        </div>
        <Tabs activeKey={tabKey} className="kit-tabs" onChange={changeTab}>
          <TabPane tab="Not Started" key="notStarted" />
          <TabPane tab="Ongoing" key="ongoing" />
          <TabPane tab="Completed" key="completed" />
          <TabPane tab="Cancelled" key="cancelled" />
        </Tabs>
      </div>
      <div className="card-body">
        {tabKey === 'notStarted' &&
          showContracts(
            CONTRACT_PROGRESS_ENUM.NOT_STARTED,
            filter(mentorshipContracts, ['progress', CONTRACT_PROGRESS_ENUM.NOT_STARTED]),
            tableColumns,
          )}
        {tabKey === 'ongoing' &&
          showContracts(
            CONTRACT_PROGRESS_ENUM.ONGOING,
            filter(mentorshipContracts, ['progress', CONTRACT_PROGRESS_ENUM.ONGOING]),
            tableColumns,
          )}
        {tabKey === 'completed' &&
          showContracts(
            CONTRACT_PROGRESS_ENUM.COMPLETED,
            filter(mentorshipContracts, ['progress', CONTRACT_PROGRESS_ENUM.COMPLETED]),
            tableColumns,
          )}
        {tabKey === 'cancelled' &&
          showContracts(
            CONTRACT_PROGRESS_ENUM.CANCELLED,
            filter(mentorshipContracts, ['progress', CONTRACT_PROGRESS_ENUM.CANCELLED]),
            tableColumns,
          )}
      </div>

      <div className="col-xl-4 col-lg-12">
        <Modal
          title="Purchase Mentorship Passes"
          visible={showBuyPass}
          cancelText="Close"
          centered
          okButtonProps={{ style: { display: 'none' } }}
          onCancel={() => setShowBuyPass(false)}
          footer={buyPassFooter}
        >
          <p className="text-dark">
            <strong>Mentorship Passes in Inventory</strong>
          </p>
          <Descriptions column={1}>
            <Descriptions.Item label="Number of passes">
              {isNil(selectedRecord.mentorPassCount) ? 0 : selectedRecord.mentorPassCount}
            </Descriptions.Item>
          </Descriptions>

          <Divider />

          <p className="text-dark">
            <strong>Number of passes to purchase</strong>
          </p>

          <Form
            id="buyPassesForm"
            layout="vertical"
            className="mt-4"
            hideRequiredMark
            onFinish={onAddPassToCart}
            onFinishFailed={onFinishFailed}
          >
            <div className="row">
              <div className="col-md-12">
                <Form.Item
                  name="numSlots"
                  label="Quantity"
                  rules={[{ required: true, message: 'Please input a valid quantity' }]}
                >
                  <InputNumber min={1} step={1} />
                </Form.Item>
              </div>
            </div>
          </Form>
        </Modal>
      </div>
    </div>
  )
}

export default MentorshipContractsTable

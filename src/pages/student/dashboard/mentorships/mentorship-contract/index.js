import { CloseOutlined, DollarCircleOutlined, UserOutlined } from '@ant-design/icons'
import { Descriptions, Button, Modal, Form, Input, Popconfirm } from 'antd'
import Avatar from 'antd/lib/avatar/avatar'
import BackBtn from 'components/Common/BackBtn'
import TaskComponent from 'components/Mentorship/Task'
import { showNotification } from 'components/utils'
import { CONTRACT_PROGRESS_ENUM, CONTRACT_TYPES } from 'constants/constants'
import {
  CONTRACT_CANCEL_ERR,
  CONTRACT_CANCEL_SUCCESS,
  ERROR,
  MENTORSHIP_REFUND_REQUESTED,
  SUCCESS,
} from 'constants/notifications'
import { isNil } from 'lodash'
import React, { useEffect, useState } from 'react'
import { Helmet } from 'react-helmet'
import { useParams } from 'react-router-dom'
import { getContract, terminateMentorshipContract } from 'services/mentorship/contracts'
import { requestRefund } from 'services/wallet'

const MentorshipContractView = () => {
  const { id } = useParams()
  const [mentorshipContract, setMentorshipContract] = useState([])
  const [mentorshipListing, setMentorshipListing] = useState([])
  const [showRefundModal, setShowRefundModal] = useState(false)
  const [isCancellable, setIsCancellable] = useState(true)
  const [showCancelPopconfirm, setShowCancelPopconfirm] = useState(false)

  const getMentorshipContract = async () => {
    const result = await getContract(id)

    if (result && !isNil(result.contract)) {
      setMentorshipContract(result.contract)
      if (!isNil(result.contract.progress)) {
        setIsCancellable(
          result.contract.progress === CONTRACT_PROGRESS_ENUM.ONGOING ||
            result.contract.progress === CONTRACT_PROGRESS_ENUM.NOT_STARTED,
        )
      }
      if (!isNil(result.contract.MentorshipListing)) {
        setMentorshipListing(result.contract.MentorshipListing)
      }
    }
  }

  useEffect(() => {
    getMentorshipContract()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  console.log('mentorshipContract is ', mentorshipContract) // Nat to deal with this in a later PR to populate the page with more subscription specific deets

  const refundFormFooter = (
    <div className="row justify-content-between">
      <div className="col-auto">
        <Button type="default" size="large" onClick={() => setShowRefundModal(false)}>
          Close
        </Button>
      </div>
      <div className="col-auto">
        <Button type="primary" form="requestRefundForm" htmlType="submit" size="large">
          Request Refund
        </Button>
      </div>
    </div>
  )

  const onFinishFailed = errorInfo => {
    console.log('Failed:', errorInfo)
  }

  const onRequestRefund = async values => {
    const response = await requestRefund(values.mentorshipContractId, CONTRACT_TYPES.MENTORSHIP)

    if (response) {
      showNotification('success', SUCCESS, MENTORSHIP_REFUND_REQUESTED)
    }
    setShowRefundModal(false)
  }

  const onCancelContract = async () => {
    const response = await terminateMentorshipContract({
      mentorshipContractId: mentorshipContract.mentorshipContractId,
      action: CONTRACT_PROGRESS_ENUM.CANCELLED,
    })

    if (response) {
      showNotification('success', SUCCESS, CONTRACT_CANCEL_SUCCESS)
      getMentorshipContract()
      setShowCancelPopconfirm(false)
    } else {
      showNotification('error', ERROR, CONTRACT_CANCEL_ERR)
    }
  }

  return (
    <div>
      <Helmet title="Mentorship Contract" />
      <div>
        <Helmet title="View Mentorship Contract" />
        <div className="row pt-2 justify-content-between">
          <div className="col-12 col-md-3 col-lg-2 mt-4 mt-md-0">
            <BackBtn />
          </div>
          <div className="col-12 col-md-3 col-lg-2 mt-4 mt-md-0">
            <Popconfirm
              title="Do you wish to cancel this mentorship contract?"
              onConfirm={() => onCancelContract()}
              okText="Yes"
              okType="danger"
              visible={showCancelPopconfirm}
            >
              <Button
                shape="round"
                size="large"
                onClick={() => setShowCancelPopconfirm(true)}
                disabled={!isCancellable}
                icon={<CloseOutlined />}
              >
                Cancel Mentorship Contract
              </Button>
            </Popconfirm>
          </div>
          <div className="col-12 col-md-3 col-lg-2 mt-4 mt-md-0">
            <Button
              danger
              shape="round"
              size="large"
              onClick={() => setShowRefundModal(true)}
              icon={<DollarCircleOutlined />}
            >
              Refund All Passes
            </Button>
          </div>
        </div>
        <div className="row mt-4">
          <div className="col-12 col-md-2 d-flex align-items-center justify-content-center">
            {/* substitute the following lines with equivalent of MentorshipProfilePicture */}
            <Avatar
              size={104}
              icon={<UserOutlined />}
              src={
                mentorshipListing.Sensei?.profileImgUrl
                  ? mentorshipListing.Sensei?.profileImgUrl
                  : '/resources/images/avatars/avatar-2.png'
              }
            />
          </div>
          {/* substitute the following lines with equivalent of MentorshipDescriptionCard */}
          <div className="col-12 col-md-5 my-2 d-flex align-items-stretch">
            <div className="card">
              <div className="card-body">
                <div className="row justify-content-between">
                  <div className="col-12 text-left mt-2">
                    <Descriptions title="Mentorship Description">
                      <p>{mentorshipListing.description}</p>
                    </Descriptions>
                  </div>
                  <div className="col-12 text-left mt-2">
                    <Descriptions title="Mentorship Progress">
                      <p>{mentorshipContract.progress}</p>
                    </Descriptions>
                  </div>
                </div>
              </div>
            </div>
          </div>
          {/* substitute the following lines with equivalent of MentorshipPricingCard */}
          <div className="col-12 col-md-5 my-2 d-flex align-items-stretch">
            <div className="card">
              <div className="card-body">
                <div className="col-12 text-left mt-2">
                  <Descriptions title="Pass Price">
                    <div>${parseFloat(mentorshipListing.priceAmount).toFixed(2)}</div>
                  </Descriptions>
                </div>
              </div>
            </div>
          </div>
          <div className="col-12">
            <TaskComponent />
          </div>
        </div>

        <div className="col-xl-4 col-lg-12">
          <Modal
            title="Request for Refund"
            visible={showRefundModal}
            cancelText="Close"
            centered
            onCancel={() => setShowRefundModal(false)}
            footer={refundFormFooter}
          >
            <Form
              id="requestRefundForm"
              layout="vertical"
              hideRequiredMark
              onFinish={onRequestRefund}
              onFinishFailed={onFinishFailed}
              initialValues={{
                mentorshipContractId: mentorshipContract.mentorshipContractId,
                name: mentorshipListing.name,
                mentorPassCount: mentorshipContract.mentorPassCount,
              }}
            >
              <div className="row">
                <div className="col-6">
                  <Form.Item name="mentorshipContractId" label="Mentorship Contract ID">
                    <Input disabled />
                  </Form.Item>
                </div>
                <div className="col-6">
                  <Form.Item name="name" label="Mentorship Name">
                    <Input disabled />
                  </Form.Item>
                </div>
                <div className="col-12">
                  <Form.Item name="mentorPassCount" label="Number of passes to be refunded">
                    <Input disabled />
                  </Form.Item>
                </div>
              </div>
            </Form>
          </Modal>
        </div>
      </div>
    </div>
  )
}

export default MentorshipContractView

import { Button, Tag } from 'antd'
import ProductCard from 'components/Cart/ProductCard'
import BackBtn from 'components/Common/BackBtn'
import StatusTag from 'components/Common/StatusTag'
import { formatTime } from 'components/utils'
import {
  BILLING_STATUS_ENUM,
  BILLING_TYPE,
  FRONTEND_API,
  USER_TYPE_ENUM,
} from 'constants/constants'
import { isEmpty, isNil, map } from 'lodash'
import React from 'react'
import { useSelector } from 'react-redux'
import { useHistory, useLocation } from 'react-router-dom'

const ViewBillingDetailCard = data => {
  const { billing, product, recipient, otherBillings } = data
  const user = useSelector(state => state.user)
  const history = useHistory()
  const { pathname } = useLocation()

  const isStudent = user.userType === USER_TYPE_ENUM.STUDENT
  const isAdmin = user.userType === USER_TYPE_ENUM.ADMIN

  const isWithdrawal = billing.billingType === BILLING_TYPE.WITHDRAWAL
  const isWithdrawn = billing.status === BILLING_STATUS_ENUM.WITHDRAWN

  const isCourse = item => {
    return item.billingType === BILLING_TYPE.COURSE
  }

  const printIframe = documentId => {
    const iframe = document.frames
      ? document.frames[documentId]
      : document.getElementById(documentId)
    const iframeWindow = iframe.contentWindow || iframe

    iframe.focus()
    iframeWindow.print()

    return false
  }

  const printButton = () => {
    return (
      <Button block ghost type="primary" onClick={() => printIframe('billingReceipt')}>
        Print
      </Button>
    )
  }

  const BillingItem = ({ children }) => {
    return (
      <div className="row align-items-center justify-content-between mb-2">
        <div className="col-auto">{children}</div>
      </div>
    )
  }

  const viewUserProfilePage = () => {
    if (!isNil(recipient)) {
      const type = recipient.userType.toLowerCase()
      const path = `/admin/user-management/${type}/${recipient.accountId}`
      history.push(path)
    }
  }

  const viewOtherBilling = record => {
    if (isStudent) {
      const path = `/student/dashboard/billing/view/${record.billingId}`
      history.push(path)
      return
    }
    const path = `/${user.userType.toLowerCase()}/billing/view/${record.billingId}`
    history.push(path)
  }

  const AdminWithdrawalContent = () => (
    <div className="card my-4">
      <div className="card-header pb-0 m-0">
        <div className="h5 card-title">Recipient Details</div>
      </div>
      <div className="card-body">
        <BillingItem>
          Account Id:
          <Button className="p-0" type="link" onClick={() => viewUserProfilePage()}>
            {recipient?.accountId}
          </Button>
        </BillingItem>
        <BillingItem>
          <span>{`Name: ${recipient?.firstName} ${recipient?.lastName}`}</span>
        </BillingItem>
        <BillingItem>
          <span>{`Email: ${recipient?.email}`}</span>
        </BillingItem>
        <BillingItem>
          <span>{`Wallet Id: ${recipient?.walletId}`}</span>
        </BillingItem>
      </div>
    </div>
  )

  const ProductContent = () => {
    if (isCourse(billing)) {
      return (
        <div className="row mb-2">
          <div className="w-100 col-12">
            <ProductCard location="BillingDetailPage" listing={product} key={product.courseId} />
          </div>
        </div>
      )
    }
    if (isWithdrawal && isAdmin) {
      return <AdminWithdrawalContent />
    }
    // to add on for case if billingType is SUBSCRIPTION
    return <div />
  }

  const OtherBillingContent = () => {
    return map(otherBillings, otherBilling => (
      <div className="row" key={otherBilling.billingId}>
        <div className="col-3">
          <Tag>{otherBilling.billingType}</Tag>
        </div>
        <div className="col-3">{isCourse(otherBilling) && otherBilling.Course.title}</div>
        <div className="col-3">
          {otherBilling.currency} {parseFloat(otherBilling.amount).toFixed(2)}
        </div>
        <div className="col-3">
          <Button type="link" onClick={() => viewOtherBilling(otherBilling)}>
            View this billing
          </Button>
        </div>
      </div>
    ))
  }

  const BillingHeader = () => {
    return (
      <div className="row align-items-center justify-content-between mb-2">
        <div className="col-auto">
          <span className="h3 font-weight-bold text-dark">{`Billing ${billing.billingId}`}</span>
        </div>
        <div className="col-auto">
          <span>{printButton()}</span>
        </div>
      </div>
    )
  }

  const BillingBody = () => {
    return (
      <div>
        <BillingItem>
          <span>
            {`Billing Type: `}
            <Tag>{billing.billingType}</Tag>
          </span>
        </BillingItem>
        <ProductContent />
        <BillingItem>
          <span>
            {!isWithdrawal && `Amount Paid: `}
            {isWithdrawal && isWithdrawn && `Amount Withdrawn: `}
            {isWithdrawal && !isWithdrawn && `Amount to Withdraw: `}
            {billing.currency} {parseFloat(billing.amount).toFixed(2)}
          </span>
        </BillingItem>
        <BillingItem>
          <span>{`Created at: ${formatTime(billing.createdAt)}`}</span>
        </BillingItem>
        <BillingItem>
          <span>
            {`Status: `}
            <StatusTag data={billing.status} type="BILLING_STATUS_ENUM" />
          </span>
        </BillingItem>

        {!isStudent && !!billing.withdrawableDate && (
          <BillingItem>
            <span>{`Withdrawable date: ${formatTime(billing.withdrawableDate)}`}</span>
          </BillingItem>
        )}

        {!!billing.paypalPaymentId && (
          <>
            <hr />
            <BillingItem>
              <span>{`This billing is part of Paypal Payment ${billing.paypalPaymentId}`}</span>
            </BillingItem>
            {!isEmpty(otherBillings) && !isNil(otherBillings) && <OtherBillingContent />}
          </>
        )}
      </div>
    )
  }

  const Footer = () => {
    return <h6 className="text-muted">{`Last updated: ${formatTime(billing.updatedAt)}`}</h6>
  }

  return (
    <>
      <iframe
        id="billingReceipt"
        name="billingReceipt"
        src={`${FRONTEND_API}${pathname}`}
        style={{ display: 'none' }}
        title="Billing Receipt"
      />
      <div className="row pt-2">
        <div className="col-12 col-md-2 mb-4">
          <BackBtn />
        </div>
      </div>
      <div className="card">
        <div className="card-header pb-1">
          <BillingHeader />
        </div>
        <div className="card-body">
          <BillingBody />
        </div>
        <div className="card-footer">
          <Footer />
        </div>
      </div>
    </>
  )
}

export default ViewBillingDetailCard

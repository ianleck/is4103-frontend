import { Button, Tag } from 'antd'
import BackBtn from 'components/Common/BackBtn'
import StatusTag from 'components/Common/StatusTag'
import { formatTime } from 'components/utils'
import { BILLING_STATUS_ENUM, BILLING_TYPE, USER_TYPE_ENUM } from 'constants/constants'
import { isNil, map } from 'lodash'
import React from 'react'
import { useSelector } from 'react-redux'
import { useHistory, useLocation } from 'react-router-dom'

const ViewBillingDetailCard = data => {
  const { billing, product, recipient } = data

  const user = useSelector(state => state.user)
  const history = useHistory()
  const { pathname } = useLocation()

  const isStudent = user.userType === USER_TYPE_ENUM.STUDENT
  const isAdmin = user.userType === USER_TYPE_ENUM.ADMIN

  const isWithdrawal = billing.billingType === BILLING_TYPE.WITHDRAWAL
  const isWithdrawn = billing.status === BILLING_STATUS_ENUM.WITHDRAWN

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

  const viewCoursePage = () => {
    const path = `/courses/${product.courseId}`
    history.push(path)
  }

  const CourseContent = () => (
    <div className="card-body">
      <div className="h5 card-title truncate-2-overflow">{product.title}</div>
      <div className="h6 card-subtitle mb-2 text-muted truncate-2-overflow">{product.subTitle}</div>
      <p className="card-text text-2-lines truncate-2-overflow">{product.description}</p>
      <p>
        {map(product.Categories, cat => {
          return (
            <Tag color="geekblue" key={cat.categoryId}>
              {cat.name}
            </Tag>
          )
        })}
      </p>
      <div className="card-footer px-0 pb-0">{`Sold by: ${product.Sensei?.firstName} ${product.Sensei?.lastName}`}</div>
    </div>
  )

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
    if (billing.billingType === 'COURSE') {
      if (isStudent) {
        return (
          <a href="#" className="card" onClick={() => viewCoursePage()}>
            <CourseContent />
          </a>
        )
      }
      return (
        <div className="card">
          <CourseContent />
        </div>
      )
    }
    if (isWithdrawal && isAdmin) {
      return <AdminWithdrawalContent />
    }
    // to add on for case if billingType is SUBSCRIPTION
    return <div />
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
        src={`http://localhost:3000${pathname}`}
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

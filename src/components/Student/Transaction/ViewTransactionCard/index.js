import { Button } from 'antd'
import BackBtn from 'components/Common/BackBtn'
import React from 'react'

const ViewTransactionCard = transactionId => {
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
      <Button block ghost type="primary" onClick={() => printIframe('transactionReceipt')}>
        Print
      </Button>
    )
  }

  const TransactionHeader = () => {
    return (
      <div className="row align-items-center justify-content-between mb-2">
        <div className="col-auto">
          <span className="h3 font-weight-bold text-dark">{`Transaction ${transactionId.transactionId}`}</span>
        </div>
        <div className="col-auto">
          <span>{printButton()}</span>
        </div>
      </div>
    )
  }

  const Footer = () => {
    return <h6 className="text-muted">Last updated:</h6>
  }

  return (
    <>
      <iframe
        id="transactionReceipt"
        name="transactionReceipt"
        src={`http://localhost:3000/student/dashboard/transaction/view/${transactionId.transactionId}`}
        style={{ display: 'none' }}
        title="Transaction Receipt"
      />
      <div className="row pt-2">
        <div className="col-12 col-md-2 mb-4">
          <BackBtn />
        </div>
      </div>
      <div className="card">
        <div className="card-header pb-1">
          <TransactionHeader />
        </div>
        <div className="card-body">COntent</div>
        <div className="card-footer">
          <Footer />
        </div>
      </div>
    </>
  )
}

export default ViewTransactionCard

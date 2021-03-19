import ViewTransactionDetailCard from 'components/Student/Transaction/ViewTransactionDetailCard'
import React from 'react'
import { useParams } from 'react-router-dom'

const TransactionView = () => {
  const { id } = useParams()
  return <ViewTransactionDetailCard transactionId={id} />
}

export default TransactionView

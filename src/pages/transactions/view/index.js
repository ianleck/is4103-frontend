import ViewTransactionCard from 'components/Student/Transaction/ViewTransactionCard'
import React from 'react'
import { useParams } from 'react-router-dom'

const TransactionView = () => {
  const { id } = useParams()
  return <ViewTransactionCard transactionId={id} />
}

export default TransactionView

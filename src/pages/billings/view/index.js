import ViewBillingDetailCard from 'components/Billing/ViewBillingDetailCard'
import React from 'react'
import { useParams } from 'react-router-dom'

const BillingView = () => {
  const { id } = useParams()
  return <ViewBillingDetailCard billingId={id} />
}

export default BillingView

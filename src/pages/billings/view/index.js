import ViewBillingDetailCard from 'components/Billing/ViewBillingDetailCard'
import { BILLING_TYPE } from 'constants/constants'
import { filter, isNil, size } from 'lodash'
import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { getSensei } from 'services/admin'
import { getCourseById } from 'services/courses'
import { getSubscription } from 'services/mentorship/subscription'
import { viewBilling, viewWallet } from 'services/wallet'

const BillingView = () => {
  const { id } = useParams()
  const [mainBilling, setMainBilling] = useState([])
  const [secondaryBillings, setSecondaryBillings] = useState([])
  const [product, setProduct] = useState([])
  const [user, setUser] = useState([])

  const viewBillingDetail = async () => {
    const result = await viewBilling({ billingId: id })
    if (result && !isNil(result.billings) && size(result.billings) === 1) {
      setMainBilling(result.billings[0])

      // for other billing(s) in same paypal payment transaction
      if (!isNil(result.billings[0].paypalPaymentId)) {
        const otherBillings = await viewBilling({
          paypalPaymentId: result.billings[0].paypalPaymentId,
        })
        if (otherBillings && !isNil(otherBillings.billings)) {
          const filteredResult = filter(otherBillings.billings, b => {
            return b.billingId !== id
          })
          setSecondaryBillings(filteredResult)
        }
      }

      // for COURSE billing
      if (result.billings[0].billingType === BILLING_TYPE.COURSE) {
        const course = await getCourseById(result.billings[0].productId)
        if (course && !isNil(course.course)) {
          setProduct(course.course)
        }
      }
      // for SUBSCRIPTION billing
      // to check when mentorship subscription cart checkout is patched
      if (result.billings[0].billingType === BILLING_TYPE.MENTORSHIP) {
        const subscription = await getSubscription(result.billings[0].contractId)
        if (subscription && !isNil(subscription)) {
          setProduct(subscription)
        }
      }
      // for WITHDRAWAL billing
      if (result.billings[0].billingType === BILLING_TYPE.WITHDRAWAL) {
        const wallet = await viewWallet(result.billings[0].receiverWalletId)
        if (wallet && !isNil(wallet.wallet)) {
          const sensei = await getSensei(wallet.wallet.accountId)
          if (sensei) {
            setUser(sensei)
          }
        }
      }
    }
  }

  useEffect(() => {
    viewBillingDetail()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
  return (
    <ViewBillingDetailCard
      billing={mainBilling}
      product={product}
      recipient={user}
      otherBillings={secondaryBillings}
    />
  )
}

export default BillingView

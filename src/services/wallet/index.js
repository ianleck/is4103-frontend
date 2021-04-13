import { isNil } from 'lodash'
import apiClient from 'services/axios'

// includes viewing transaction history
export async function viewWallet(walletId) {
  const url = `/wallet/${walletId}`
  return apiClient
    .get(url)
    .then(response => {
      if (response && !isNil(response.data)) {
        return response.data
      }
      return false
    })
    .catch(err => console.log(err))
}

// only for Admin
export async function viewBillings(body) {
  const url = `/admin/withdrawals/filter`
  return apiClient
    .get(url, { params: { ...body } })
    .then(response => {
      if (response && !isNil(response.data)) {
        return response.data
      }
      return false
    })
    .catch(err => console.log(err))
}

// only for Sensei
// this sends a withdrawal request to the admin
export async function requestWithdrawal(walletId) {
  const url = `/wallet/${walletId}`
  return apiClient
    .put(url)
    .then(response => {
      if (response && !isNil(response.data)) {
        return response.data
      }
      return false
    })
    .catch(err => console.log(err))
}

export async function approveWithdrawalRequest(billingId) {
  const url = `/admin/withdrawal/${billingId}`
  return apiClient
    .post(url)
    .then(response => {
      if (response && !isNil(response.data)) {
        return response.data
      }
      return false
    })
    .catch(err => console.log(err))
}

export async function rejectWithdrawalRequest(billingId) {
  const url = `/admin/withdrawal/${billingId}`
  return apiClient
    .put(url)
    .then(response => {
      if (response && !isNil(response.data)) {
        return response.data
      }
      return false
    })
    .catch(err => console.log(err))
}

export async function viewWalletList() {
  const url = `/admin/wallets/sensei`
  return apiClient
    .get(url)
    .then(response => {
      if (response && !isNil(response.data)) {
        return response.data
      }
      return false
    })
    .catch(err => console.log(err))
}

export async function viewBilling(body) {
  const url = `/wallet/billings/filter`
  return apiClient
    .get(url, { params: { filter: { ...body } } })
    .then(response => {
      if (response && !isNil(response.data)) {
        return response.data
      }
      return false
    })
    .catch(err => console.log(err))
}

export async function requestRefund(contractId, productType) {
  const url = `/wallet/refund?contractId=${contractId}&contractType=${productType}`
  return apiClient
    .post(url, { withCredentials: true })
    .then(response => {
      if (response && !isNil(response.data)) {
        return response.data
      }
      return false
    })
    .catch(err => console.log(err))
}

export async function getRefunds() {
  const url = `/wallet/refund`
  return apiClient
    .get(url, { withCredentials: true })
    .then(response => {
      if (response && !isNil(response.data)) {
        return response.data
      }
      return false
    })
    .catch(err => console.log(err))
}

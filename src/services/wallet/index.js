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
export async function viewBillings() {
  const url = `/wallet/billings`
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

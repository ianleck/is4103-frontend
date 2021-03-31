import { isNil } from 'lodash'
import apiClient from 'services/axios'

export async function getFollowingList(accountId) {
  const url = `/social/following/${accountId}`
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

export async function acceptFollowingRequest(accountId) {
  const url = `/social/following/accept/${accountId}`
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

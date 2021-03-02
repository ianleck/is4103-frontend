import { isNil } from 'lodash'
import apiClient from 'services/axios'

export async function acceptMentorshipApplication(mentorshipContractId) {
  const url = `/mentorship/accept-application/${mentorshipContractId}`
  return apiClient
    .put(url)
    .then(response => {
      console.log('response = ', response)
      if (response && !isNil(response.data)) {
        return response.data
      }
      return false
    })
    .catch(err => console.log(err))
}

export async function createMentorshipApplication(mentorshipListingId, body) {
  const url = `/mentorship/contract/${mentorshipListingId}`
  return apiClient
    .post(url, body)
    .then(response => {
      if (response && !isNil(response.data)) {
        return response.data
      }
      return false
    })
    .catch(err => console.log(err))
}

export async function rejectMentorshipApplication(mentorshipContractId) {
  const url = `/mentorship/reject-application/${mentorshipContractId}`
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

export async function getSenseiMentorshipApplications(accountId) {
  const url = `/mentorship/contract/sensei/${accountId}`
  return apiClient
    .get(url)
    .then(response => {
      console.log('response ====', response)
      if (response && !isNil(response.data)) {
        return response.data
      }
      return false
    })
    .catch(err => console.log(err))
}

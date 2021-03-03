import { isNil } from 'lodash'
import apiClient from 'services/axios'

export async function createMentorshipListing(mentorshipListing) {
  const url = `/mentorship/listing/`
  return apiClient
    .post(url, { mentorshipListing })
    .then(response => {
      if (response && !isNil(response.data)) {
        return response.data
      }
      return false
    })
    .catch(err => console.log(err))
}

export async function deleteMentorshipListing(mentorshipListingId) {
  const url = `/mentorship/listing/${mentorshipListingId}`
  return apiClient
    .delete(url)
    .then(response => {
      if (response && !isNil(response.data)) {
        return response.data
      }
      return false
    })
    .catch(err => console.log(err))
}

export async function getSenseiMentorshipListings(accountId) {
  const url = `/mentorship/listing/sensei/${accountId}`
  return apiClient
    .get(url)
    .then(response => {
      if (response && !isNil(response.data)) {
        return response.data.mentorshipListings
      }
      return false
    })
    .catch(err => console.log(err))
}

export async function updateMentorshipListing(data) {
  const url = `/mentorship/listing/${data.mentorshipListingId}`
  return apiClient
    .put(url, {
      mentorshipListing: {
        name: data.name,
        description: data.description,
        categories: data.categories,
      },
    })
    .then(response => {
      return response.data
    })
    .catch(err => console.log(err))
}

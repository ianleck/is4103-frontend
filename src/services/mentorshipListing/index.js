import { isNil } from 'lodash'
import apiClient from 'services/axios'

export async function createMentorshipListing(
  mentorshipName,
  mentorshipDescription,
  mentorshipCategories,
) {
  const url = `/mentorship/listing/`
  const mentorshipListing = {
    name: mentorshipName,
    description: mentorshipDescription,
    categories: mentorshipCategories,
  }
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
      console.log('response =', response)
      if (response && !isNil(response.data)) {
        return response.data
      }
      return false
    })
    .catch(err => console.log(err))
}

export async function getSenseiMentorshipListings(accountId) {
  console.log('in getSenseiMentorshipListings ')
  const url = `/mentorship/listing/sensei/${accountId}`
  return apiClient
    .get(url)
    .then(response => {
      console.log('response received is ', response)
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

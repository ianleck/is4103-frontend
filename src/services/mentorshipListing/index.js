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

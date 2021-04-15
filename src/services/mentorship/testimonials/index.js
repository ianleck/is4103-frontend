import { isNil } from 'lodash'
import apiClient from 'services/axios'

export async function createTestimonial(payload) {
  const { mentorshipContractId, accountId, testimonial } = payload
  const url = `/mentorship/testimonial/${mentorshipContractId}/${accountId}`
  return apiClient
    .post(url, { newTestimonial: { body: testimonial } })
    .then(response => {
      if (response && !isNil(response.data)) {
        return response.data
      }
      return false
    })
    .catch(err => console.log(err))
}

export async function editTestimonial(payload) {
  const { testimonialId, testimonial } = payload
  const url = `/mentorship/testimonial/${testimonialId}`
  return apiClient
    .put(url, { editedTestimonial: { body: testimonial } })
    .then(response => {
      if (response && !isNil(response.data)) {
        return response.data
      }
      return false
    })
    .catch(err => console.log(err))
}

export async function getTestimonialByFilter(payload) {
  const url = `/mentorship/testimonial/list`
  return apiClient
    .get(url, { ...payload })
    .then(response => {
      if (response && !isNil(response.data)) {
        return response.data
      }
      return false
    })
    .catch(err => console.log(err))
}

export async function getSenseiTestimonials(accountId) {
  const url = `/mentorship/testimonial/list/${accountId}`
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

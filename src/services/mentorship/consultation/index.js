import { isNil } from 'lodash'
import apiClient from 'services/axios'

export async function getConsultations(dateStart, dateEnd) {
  return apiClient
    .get(`/consultation/?dateStart=${dateStart}&dateEnd=${dateEnd}`, { withCredentials: true })
    .then(response => {
      if (response && !isNil(response.data)) {
        if (response.data.success) return response.data
      }
      return false
    })
    .catch(err => console.log(err))
}

export async function createConsultation(dateStart, dateEnd, newSlot) {
  return apiClient
    .post(
      `/consultation/?dateStart=${dateStart}&dateEnd=${dateEnd}`,
      {
        newSlot,
      },
      { withCredentials: true },
    )
    .then(response => {
      if (response && !isNil(response.data)) {
        if (response.data.success) return response.data
      }
      return false
    })
    .catch(err => console.log(err))
}

export async function editConsultation(complaintReason) {
  return apiClient
    .post(`/consultation/reason/`, { complaintReason }, { withCredentials: true })
    .then(response => {
      if (response && !isNil(response.data)) {
        if (response.data.success) return response.data
      }
      return false
    })
    .catch(err => console.log(err))
}

export async function deleteConsultation(consultationId, dateStart, dateEnd) {
  return apiClient
    .delete(
      `/consultation/?consultationId=${consultationId}&dateStart=${dateStart}&dateEnd=${dateEnd}`,
      { withCredentials: true },
    )
    .then(response => {
      if (response && !isNil(response.data)) {
        if (response.data.success) return response.data
      }
      return false
    })
    .catch(err => console.log(err))
}

import apiClient from 'services/axios'
import { isNil } from 'lodash'

export async function getMentorshipSales(dateStart, dateEnd) {
  const url = `/analytics/mentorship/?dateStart=${dateStart}&dateEnd=${dateEnd}`
  return apiClient
    .get(url, dateStart, dateEnd)
    .then(response => {
      if (response && !isNil(response.data)) {
        return response.data
      }
      return false
    })
    .catch(err => console.log(err))
}

export async function getCourseSales(dateStart, dateEnd) {
  const url = `/analytics/course/?dateStart=${dateStart}&dateEnd=${dateEnd}`
  return apiClient
    .get(url, dateStart, dateEnd)
    .then(response => {
      if (response && !isNil(response.data)) {
        return response.data
      }
      return false
    })
    .catch(err => console.log(err))
}

export async function getListingApplications(dateStart, dateEnd) {
  const url = `/analytics/mentorship/applications/?dateStart=${dateStart}&dateEnd=${dateEnd}`
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

export async function getCourseCategorySales(dateStart, dateEnd) {
  const url = `/analytics/categories/course/?dateStart=${dateStart}&dateEnd=${dateEnd}`
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

export async function getMentorshipCategorySales(dateStart, dateEnd) {
  const url = `/analytics/categories/mentorship/?dateStart=${dateStart}&dateEnd=${dateEnd}`
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

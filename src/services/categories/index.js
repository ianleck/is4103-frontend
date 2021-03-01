/* eslint-disable import/prefer-default-export */
import { isNil } from 'lodash'
import apiClient from 'services/axios'

export async function getCategories() {
  const url = '/category/'
  return apiClient
    .get(url, {})
    .then(response => {
      if (!isNil(response.data)) {
        return response.data.categories
      }
      return false
    })
    .catch(err => console.log(err))
}

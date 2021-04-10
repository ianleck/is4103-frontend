import { isNil } from 'lodash'
import apiClient from 'services/axios'

export async function searchByFilter(query) {
  const url = `/search/${query}`
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

export default searchByFilter

import { isNil } from 'lodash'
import apiClient from 'services/axios'

export async function getPosts(accountId) {
  const url = `/social/post/${accountId}`
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

export async function addPost(accountId, payload) {
  const url = `/social/post/${accountId}`
  return apiClient
    .post(url, {
      newPost: {
        ...payload,
      },
    })
    .then(response => {
      if (response && !isNil(response.data)) {
        return response.data
      }
      return false
    })
    .catch(err => console.log(err))
}

export async function editPost(accountId, payload) {
  const url = `/social/post/${accountId}`
  return apiClient
    .put(url, {
      editedPost: {
        ...payload,
      },
    })
    .then(response => {
      if (response && !isNil(response.data)) {
        return response.data
      }
      return false
    })
    .catch(err => console.log(err))
}

export async function likePost(postId) {
  const url = `/social/post/like/${postId}`
  return apiClient
    .post(url)
    .then(response => {
      if (response && !isNil(response.data)) {
        return response.data
      }
      return false
    })
    .catch(err => console.log(err))
}

export async function unlikePost(postId) {
  const url = `/social/post/unlike/${postId}`
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

export async function addCommentToPost(postId, payload) {
  const url = `/comment/post/${postId}`
  return apiClient
    .post(url, {
      comment: {
        ...payload,
      },
    })
    .then(response => {
      if (response && !isNil(response.data)) {
        return response.data
      }
      return false
    })
    .catch(err => console.log(err))
}

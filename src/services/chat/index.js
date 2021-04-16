import { isNil } from 'lodash'
import apiClient from 'services/axios'

export async function getChats(accountId) {
  return apiClient
    .get(`/chat/list/${accountId}`, { withCredentials: true })
    .then(response => {
      if (response && !isNil(response.data)) {
        if (response.data.success) return response.data
      }
      return false
    })
    .catch(err => console.log(err))
}

export async function sendMessage(accountId, newMessage) {
  return apiClient
    .post(
      `/chat/message/${accountId}`,
      {
        newMessage,
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

export async function sendGroupMessage(chatId, newMessage) {
  return apiClient
    .post(
      `/chat/message/chat-group/${chatId}`,
      {
        newMessage,
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

export async function createChatGroup(newChatGroup) {
  return apiClient
    .post(
      `/chat/chat-group/`,
      {
        newChatGroup,
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

export async function deleteChatGroup(chatGroupId) {
  return apiClient
    .delete(`/chat/chat-group/${chatGroupId}`, { withCredentials: true })
    .then(response => {
      if (response && !isNil(response.data)) {
        if (response.data.success) return response.data
      }
      return false
    })
    .catch(err => console.log(err))
}

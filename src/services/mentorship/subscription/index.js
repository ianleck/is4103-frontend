import { isNil } from 'lodash'
import apiClient from 'services/axios'

// ============================ MENTORSHIP SUBSCRIPTION / CONTRACT ============================
export async function getSubscription(mentorshipContractId) {
  const url = `/mentorship/contract/${mentorshipContractId}`
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

export async function getMentees(accountId) {
  const url = `/mentorship/sensei/${accountId}`
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

export async function getActiveMentorshipContract(mentorshipContractId) {
  const url = `/mentorship/contract/active/${mentorshipContractId}`
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

export async function getActiveMentorshipContractList(accountId) {
  const url = `/mentorship/contract/all/active/${accountId}`
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

export async function terminateMentorshipContract(payload) {
  const { mentorshipContractId, action } = payload
  const url = `/mentorship/contract?mentorshipContractId=${mentorshipContractId}&action=${action}`
  return apiClient
    .put(url)
    .then(response => {
      if (response && !isNil(response.data)) {
        return response.data
      }
      return false
    })
    .catch(err => console.log(err))
}

// ============================ TASK BUCKET ============================

export async function getTaskBuckets(mentorshipContractId) {
  const url = `/mentorship/task-bucket/all/${mentorshipContractId}`
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
export async function createTaskBucket(mentorshipContractId, newTaskBucket) {
  const url = `/mentorship/task-bucket/${mentorshipContractId}`
  return apiClient
    .post(url, { newTaskBucket })
    .then(response => {
      if (response && !isNil(response.data)) {
        return response.data
      }
      return false
    })
    .catch(err => console.log(err))
}

export async function updateTaskBucket(taskBucketId, updatedBucket) {
  const url = `/mentorship/task-bucket/${taskBucketId}`
  const editedTaskBucket = {
    title: updatedBucket.title,
    taskOrder: updatedBucket.taskOrder,
  }
  return apiClient
    .put(url, { editedTaskBucket })
    .then(response => {
      if (response && !isNil(response.data)) {
        return response.data
      }
      return false
    })
    .catch(err => console.log(err))
}

export async function deleteTaskBucket(taskBucketId) {
  const url = `/mentorship/task-bucket/${taskBucketId}`
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

// ============================ TASKS ============================

export async function addTask(taskBucketId) {
  const url = `/mentorship/task-bucket/task/${taskBucketId}`
  return apiClient
    .post(url, { newTask: { body: '' } })
    .then(response => {
      if (response && !isNil(response.data)) {
        return response.data
      }
      return false
    })
    .catch(err => console.log(err))
}
export async function updateTask(taskId, editedTask) {
  const url = `/mentorship/task-bucket/task/${taskId}`
  return apiClient
    .put(url, { editedTask })
    .then(response => {
      if (response && !isNil(response.data)) {
        return response.data
      }
      return false
    })
    .catch(err => console.log(err))
}

export async function deleteTask(taskId) {
  const url = `/mentorship/task-bucket/task/${taskId}`
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

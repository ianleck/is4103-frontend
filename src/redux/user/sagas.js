import { all, takeEvery, put, call, select, putResolve } from 'redux-saga/effects'
import { notification } from 'antd'
import { history } from 'index'
import { USER_TYPE_ENUM } from 'constants/constants'
import { DP_REMOVED, SUCCESS } from 'constants/notifications'
import { isEmpty, isNil } from 'lodash'
import * as jwt from 'services/user'
import {
  createAdminObj,
  createUserObj,
  resetCart,
  resetUser,
  showNotification,
} from 'components/utils'
import actions from './actions'
import * as selectors from '../selectors'

function checkProfileUpdateRqd(user) {
  user.requiresProfileUpdate =
    user.headline === '' ||
    isNil(user.headline) ||
    user.bio === '' ||
    isNil(user.bio) ||
    user.firstName === '' ||
    isNil(user.firstName) ||
    user.lastName === '' ||
    isNil(user.lastName)

  return user.requiresProfileUpdate
}

export function* LOAD_CURRENT_ACCOUNT() {
  yield put({
    type: 'user/SET_STATE',
    payload: {
      loading: true,
    },
  })
  let currentUser = resetUser
  const user = yield call(jwt.getLocalUserData)
  if (user) {
    if (user.userType === USER_TYPE_ENUM.ADMIN) {
      currentUser = createAdminObj(user, user.authorized, user.loading)
    } else if (!isEmpty(user.accountId)) {
      const userFromAPI = yield call(jwt.getProfile, user.accountId)
      if (userFromAPI) {
        userFromAPI.accessToken = user.accessToken
        currentUser = createUserObj(
          userFromAPI,
          user.authorized,
          user.loading,
          checkProfileUpdateRqd(userFromAPI),
        )
      }
    } else {
      currentUser = createUserObj(user, user.authorized, user.loading, user.requiresProfileUpdate)
    }
    yield call(jwt.updateLocalUserData, currentUser)
    yield putResolve({
      type: 'user/SET_STATE',
      payload: currentUser,
    })
  }
  yield putResolve({
    type: 'menu/GET_DATA',
  })
  yield putResolve({
    type: 'categories/GET_CATEGORIES',
  })
  yield putResolve({
    type: 'cart/LOAD_CURRENT_CART',
  })
  yield putResolve({
    type: 'social/LOAD_CURRENT_SOCIAL',
  })
  yield put({
    type: 'user/SET_STATE',
    payload: {
      loading: false,
    },
  })
}

export function* LOGIN({ payload }) {
  const { email, password, isAdmin } = payload
  yield put({
    type: 'user/SET_STATE',
    payload: {
      loading: true,
    },
  })
  const response = yield call(jwt.login, email, password, isAdmin)
  if (response) {
    const currentUser = isAdmin
      ? createAdminObj(response, true, false)
      : createUserObj(response, true, false, checkProfileUpdateRqd(response))
    yield putResolve({
      type: 'user/SET_STATE',
      payload: {
        ...currentUser,
      },
    })
    yield call(jwt.updateLocalUserData, currentUser)
    switch (currentUser.userType) {
      case USER_TYPE_ENUM.ADMIN:
        yield history.push('/admin')
        break
      case USER_TYPE_ENUM.SENSEI:
        yield history.push('/sensei')
        break
      case USER_TYPE_ENUM.STUDENT:
        yield history.push('/')
        break
      default:
        yield history.push('/')
        break
    }
    if (isNil(currentUser.firstName)) currentUser.firstName = 'Anonymous'
    if (isNil(currentUser.lastName)) currentUser.lastName = 'Pigeon'
    notification.success({
      message: 'Logged In',
      description: `Welcome to Digi Dojo, ${currentUser.firstName} ${currentUser.lastName}.`,
    })
    yield putResolve({
      type: 'menu/GET_DATA',
    })
    yield putResolve({
      type: 'categories/GET_CATEGORIES',
    })
    yield putResolve({
      type: 'cart/LOAD_CURRENT_CART',
    })
    yield putResolve({
      type: 'social/LOAD_CURRENT_SOCIAL',
    })
  }
  yield putResolve({
    type: 'user/SET_STATE',
    payload: {
      loading: false,
    },
  })
}

export function* REGISTER({ payload }) {
  const { username, email, password, confirmPassword, isStudent } = payload
  yield put({
    type: 'user/SET_STATE',
    payload: {
      loading: true,
    },
  })
  const response = yield call(jwt.register, username, email, password, confirmPassword, isStudent)
  if (response) {
    const currentUser = createUserObj(response, true, false, true)
    yield putResolve({
      type: 'user/SET_STATE',
      payload: {
        ...currentUser,
      },
    })
    yield call(jwt.updateLocalUserData, currentUser)
    notification.success({
      message: 'Account created successfully.',
      description: 'Let us know more about you!',
    })
  }
  yield put({
    type: 'menu/GET_DATA',
  })
  yield put({
    type: 'user/SET_STATE',
    payload: {
      loading: false,
    },
  })
}

export function* CHANGE_PASSWORD({ payload }) {
  const { oldPassword, newPassword, confirmPassword } = payload
  yield put({
    type: 'user/SET_STATE',
    payload: {
      loading: true,
    },
  })
  const response = yield call(jwt.changePassword, oldPassword, newPassword, confirmPassword)
  if (response) {
    notification.success({
      message: 'Password changed successfully.',
    })
  }
  yield put({
    type: 'user/SET_STATE',
    payload: {
      loading: false,
    },
  })
}

export function* LOGOUT() {
  yield call(jwt.logout)
  yield putResolve({
    type: 'user/SET_STATE',
    payload: resetUser,
  })
  yield putResolve({
    type: 'cart/SET_STATE',
    payload: resetCart,
  })
  yield putResolve({
    type: 'menu/GET_DATA',
  })
  yield history.push('/')
}

export function* UPDATE_PROFILE({ payload }) {
  yield put({
    type: 'user/SET_STATE',
    payload: {
      loading: true,
    },
  })
  if (isNil(payload.accountId)) {
    yield put({
      type: 'user/SET_STATE',
      payload: {
        loading: false,
      },
    })
    return false
  }
  let settingsUpdate = false
  if (!isNil(payload.changeAccSettings)) {
    if (payload.changeAccSettings) {
      settingsUpdate = payload.changeAccSettings
      delete payload.changeAccSettings
    }
  }
  const { accountId } = payload
  delete payload.accountId

  const response = yield call(jwt.updateProfile, accountId, payload)
  if (response) {
    const updatedUser = handleProfileUpdateRsp(response)
    if (updatedUser) {
      yield putResolve({
        type: 'user/SET_STATE',
        payload: {
          ...updatedUser,
        },
      })
      jwt.updateLocalUserData(updatedUser)
      if (settingsUpdate) {
        notification.success({
          message: 'Your settings were successfully updated.',
        })
      } else {
        notification.success({
          message: 'Your profile was successfully updated.',
        })
      }
    }
  }
  yield putResolve({
    type: 'menu/GET_DATA',
  })
  yield put({
    type: 'user/SET_STATE',
    payload: {
      loading: false,
    },
  })
}

function handleProfileUpdateRsp(response) {
  if (response) {
    const currentUser = createUserObj(response, true, false, checkProfileUpdateRqd(response))
    const localStorageUser = jwt.getLocalUserData()
    if (!isEmpty(localStorageUser.accessToken))
      currentUser.accessToken = localStorageUser.accessToken
    if (!isNil(localStorageUser.Experience)) currentUser.Experience = localStorageUser.Experience
    return currentUser
  }
  return false
}

export function* ADD_EXPERIENCE({ payload }) {
  const { accountId, role, dateStart, dateEnd, description, companyName, companyUrl } = payload
  yield put({
    type: 'user/SET_STATE',
    payload: {
      loading: true,
    },
  })
  const response = yield call(
    jwt.addExperience,
    accountId,
    role,
    dateStart,
    dateEnd,
    description,
    companyName,
    companyUrl,
  )
  if (response) {
    if (response.experience) {
      const currentUser = yield select(selectors.user)
      const experiences = currentUser.Experience
      experiences.push(response.experience)
      yield putResolve({
        type: 'user/SET_STATE',
        payload: {
          Experience: experiences,
        },
      })
      yield call(jwt.updateLocalUserData, currentUser)
      notification.success({
        message: 'New experience added',
      })
    }
  }
  yield put({
    type: 'user/SET_STATE',
    payload: {
      loading: false,
    },
  })
}

export function* EDIT_EXPERIENCE({ payload }) {
  const {
    accountId,
    experienceId,
    role,
    dateStart,
    dateEnd,
    description,
    companyName,
    companyUrl,
  } = payload
  yield put({
    type: 'user/SET_STATE',
    payload: {
      loading: true,
    },
  })
  const response = yield call(
    jwt.editExperience,
    accountId,
    experienceId,
    role,
    dateStart,
    dateEnd,
    description,
    companyName,
    companyUrl,
  )
  if (response) {
    if (response.experience) {
      const currentUser = yield select(selectors.user)
      const experiences = currentUser.Experience
      const updatedExperiences = experiences.filter(obj => {
        return obj.experienceId !== experienceId
      })
      updatedExperiences.push(response.experience)
      yield putResolve({
        type: 'user/SET_STATE',
        payload: {
          Experience: updatedExperiences,
        },
      })
      yield call(jwt.updateLocalUserData, currentUser)
      notification.success({
        message: 'Your experience was updated successfully.',
      })
    }
  }
  yield put({
    type: 'user/SET_STATE',
    payload: {
      loading: false,
    },
  })
}

export function* DELETE_EXPERIENCE({ payload }) {
  const { accountId, experienceId } = payload
  yield put({
    type: 'user/SET_STATE',
    payload: {
      loading: true,
    },
  })
  const response = yield call(jwt.deleteExperience, accountId, experienceId)
  if (response) {
    const currentUser = yield select(selectors.user)
    const experiences = currentUser.Experience
    const updatedExperiences = experiences.filter(obj => {
      return obj.experienceId !== experienceId
    })
    yield putResolve({
      type: 'user/SET_STATE',
      payload: {
        Experience: updatedExperiences,
      },
    })
    yield call(jwt.updateLocalUserData, currentUser)
    notification.success({
      message: 'Your experience was deleted successfully.',
    })
  }
  yield put({
    type: 'user/SET_STATE',
    payload: {
      loading: false,
    },
  })
}

export function* DELETE_ACCOUNT({ payload }) {
  const { accountId } = payload
  yield put({
    type: 'user/SET_STATE',
    payload: {
      loading: true,
    },
  })
  const response = yield call(jwt.deleteAccount, accountId)
  if (response) {
    yield put({
      type: 'user/SET_STATE',
      payload: {
        loading: false,
      },
    })
    yield call(jwt.logout)
    yield putResolve({
      type: 'user/SET_STATE',
      payload: resetUser,
    })
    yield putResolve({
      type: 'menu/GET_DATA',
    })
    yield history.push('/')
    yield notification.success({
      message: 'Your account was sucessfully deleted.',
    })
  }
}

export function* DELETE_DP() {
  yield put({
    type: 'user/SET_STATE',
    payload: {
      loading: true,
    },
  })

  const response = yield call(jwt.removeFile, 'dp')
  if (response) {
    const updatedUser = handleProfileUpdateRsp(response)
    if (updatedUser) {
      yield putResolve({
        type: 'user/SET_STATE',
        payload: {
          ...updatedUser,
        },
      })
      jwt.updateLocalUserData(updatedUser)

      showNotification('success', SUCCESS, DP_REMOVED)
    }
  }
  yield putResolve({
    type: 'menu/GET_DATA',
  })
  yield put({
    type: 'user/SET_STATE',
    payload: {
      loading: false,
    },
  })
}

export default function* rootSaga() {
  yield all([
    takeEvery(actions.LOAD_CURRENT_ACCOUNT, LOAD_CURRENT_ACCOUNT),
    takeEvery(actions.LOGIN, LOGIN),
    takeEvery(actions.REGISTER, REGISTER),
    takeEvery(actions.LOGOUT, LOGOUT),
    takeEvery(actions.CHANGE_PASSWORD, CHANGE_PASSWORD),
    takeEvery(actions.DELETE_ACCOUNT, DELETE_ACCOUNT),
    takeEvery(actions.UPDATE_PROFILE, UPDATE_PROFILE),
    takeEvery(actions.ADD_EXPERIENCE, ADD_EXPERIENCE),
    takeEvery(actions.EDIT_EXPERIENCE, EDIT_EXPERIENCE),
    takeEvery(actions.DELETE_EXPERIENCE, DELETE_EXPERIENCE),
    takeEvery(actions.DELETE_DP, DELETE_DP),
    LOAD_CURRENT_ACCOUNT(), // run once on app load to check user auth
  ])
}

import { all, takeEvery, put, call, select, putResolve } from 'redux-saga/effects'
import { notification } from 'antd'
import { history } from 'index'
import { USER_TYPE_ENUM } from 'constants/constants'
import { isEmpty, isNil } from 'lodash'
import * as jwt from 'services/jwt'
import { createAdminObj, createUserObj, resetUser } from 'components/utils'
import actions from './actions'
import * as selectors from '../selectors'

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
      : createUserObj(
          response,
          true,
          false,
          isNil(response.firstName) || isNil(response.lastName) || isNil(response.contactNumber),
        )

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
    yield put({
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

export function* LOAD_CURRENT_ACCOUNT() {
  yield put({
    type: 'user/SET_STATE',
    payload: {
      loading: true,
    },
  })
  const user = yield call(jwt.getLocalUserData)
  if (user) {
    let currentUser = resetUser
    if (user.userType === USER_TYPE_ENUM.ADMIN) {
      currentUser = createAdminObj(user, user.authorized, user.loading)
    } else {
      let userFromAPI = resetUser
      if (!isEmpty(user.accountId)) {
        userFromAPI = yield call(jwt.getProfile, user.accountId)
        currentUser = createUserObj(
          userFromAPI,
          user.authorized,
          user.loading,
          user.requiresProfileUpdate,
        )
      } else {
        currentUser = createUserObj(user, user.authorized, user.loading, user.requiresProfileUpdate)
      }
    }
    yield putResolve({
      type: 'user/SET_STATE',
      payload: currentUser,
    })
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

export function* LOGOUT() {
  yield call(jwt.logout)
  yield putResolve({
    type: 'user/SET_STATE',
    payload: resetUser,
  })
  yield putResolve({
    type: 'menu/GET_DATA',
  })
  yield history.push('/')
}

export function* UPDATE_PROFILE({ payload }) {
  const { accountId, firstName, lastName, contactNumber, isStudent } = payload
  yield put({
    type: 'user/SET_STATE',
    payload: {
      loading: true,
    },
  })
  const response = yield call(
    jwt.updateProfile,
    accountId,
    firstName,
    lastName,
    contactNumber,
    isStudent,
  )
  if (response) {
    let currentUser = createUserObj(response, true, false, false)
    yield putResolve({
      type: 'user/SET_STATE',
      payload: {
        firstName: currentUser.firstName,
        lastName: currentUser.lastName,
        contactNumber: currentUser.contactNumber,
      },
    })
    yield call(jwt.updateLocalUserData, currentUser)
    currentUser = yield select(selectors.user)
    if (currentUser.requiresProfileUpdate) {
      currentUser.requiresProfileUpdate = false
      yield call(jwt.updateLocalUserData, currentUser)
      yield putResolve({
        type: 'user/SET_STATE',
        payload: {
          requiresProfileUpdate: false,
        },
      })
    }
    notification.success({
      message: 'Profile Updated Successfully',
      description: 'We have received your new personal information.',
    })
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

export function* UPDATE_ABOUT({ payload }) {
  const { accountId, isStudent, updateHeadline, headline, bio } = payload
  yield put({
    type: 'user/SET_STATE',
    payload: {
      loading: true,
    },
  })
  const response = yield call(jwt.updateAbout, accountId, isStudent, updateHeadline, headline, bio)
  if (response) {
    let currentUser = createUserObj(response, true, false, false)
    yield putResolve({
      type: 'user/SET_STATE',
      payload: {
        headline: currentUser.headline,
        bio: currentUser.bio,
      },
    })
    yield call(jwt.updateLocalUserData, currentUser)
    currentUser = yield select(selectors.user)
    notification.success({
      message: 'Profile Updated',
    })
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

export function* UPDATE_ACCOUNT_SETTINGS({ payload }) {
  const { accountId, isStudent, isPrivateProfile, emailNotification, chatPrivacy } = payload
  yield put({
    type: 'user/SET_STATE',
    payload: {
      loading: true,
    },
  })
  const response = yield call(
    jwt.updateAccountSettings,
    accountId,
    isStudent,
    isPrivateProfile,
    emailNotification,
    chatPrivacy,
  )
  if (response) {
    let currentUser = createUserObj(response, true, false, false)
    yield putResolve({
      type: 'user/SET_STATE',
      payload: {
        isPrivateProfile: currentUser.isPrivateProfile,
        emailNotification: currentUser.emailNotification,
        chatPrivacy: currentUser.chatPrivacy,
      },
    })
    yield call(jwt.updateLocalUserData, currentUser)
    currentUser = yield select(selectors.user)
    notification.success({
      message: 'Account Settings Updated',
    })
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

export function* UPDATE_WORK_DETAILS({ payload }) {
  const { accountId, isStudent, isIndustry, industry, occupation } = payload
  yield put({
    type: 'user/SET_STATE',
    payload: {
      loading: true,
    },
  })
  const response = yield call(
    jwt.updateWorkDetails,
    accountId,
    isStudent,
    isIndustry,
    industry,
    occupation,
  )
  if (response) {
    let currentUser = createUserObj(response, true, false, false)
    yield putResolve({
      type: 'user/SET_STATE',
      payload: {
        industry: currentUser.industry,
        occupation: currentUser.occupation,
      },
    })
    yield call(jwt.updateLocalUserData, currentUser)
    currentUser = yield select(selectors.user)
    if (isIndustry) {
      notification.success({
        message: 'Industry Details Updated',
      })
    } else {
      notification.success({
        message: 'Occupation Details Updated',
      })
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

export function* ADD_EXPERIENCE({ payload }) {
  const { accountId, role, dateStart, dateEnd, description, companyName, companyUrl } = payload
  yield put({
    type: 'user/SET_STATE',
    payload: {
      loading: true,
    },
  })
  console.log(accountId, role, dateStart, dateEnd, description, companyName, companyUrl)
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
      console.log('curr user', currentUser)
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

export default function* rootSaga() {
  yield all([
    takeEvery(actions.LOGIN, LOGIN),
    takeEvery(actions.REGISTER, REGISTER),
    takeEvery(actions.LOGOUT, LOGOUT),
    takeEvery(actions.CHANGE_PASSWORD, CHANGE_PASSWORD),
    takeEvery(actions.LOAD_CURRENT_ACCOUNT, LOAD_CURRENT_ACCOUNT),
    takeEvery(actions.UPDATE_PROFILE, UPDATE_PROFILE),
    takeEvery(actions.DELETE_ACCOUNT, DELETE_ACCOUNT),
    takeEvery(actions.UPDATE_ACCOUNT_SETTINGS, UPDATE_ACCOUNT_SETTINGS),
    takeEvery(actions.UPDATE_ABOUT, UPDATE_ABOUT),
    takeEvery(actions.UPDATE_WORK_DETAILS, UPDATE_WORK_DETAILS),
    takeEvery(actions.ADD_EXPERIENCE, ADD_EXPERIENCE),
    LOAD_CURRENT_ACCOUNT(), // run once on app load to check user auth
  ])
}

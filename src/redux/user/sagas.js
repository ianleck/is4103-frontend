import { all, takeEvery, put, call, select, putResolve } from 'redux-saga/effects'
import { notification } from 'antd'
import { history } from 'index'
import { USER_TYPE_ENUM } from 'constants/constants'
import { isEmpty, isNil } from 'lodash'
import * as jwt from 'services/jwt'
import { createAdminObj, createUserObj, resetUser } from 'components/utils'
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
    isNil(user.lastName) ||
    user.contactNumber === '' ||
    isNil(user.contactNumber)

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
    type: 'menu/GET_DATA',
  })
  yield history.push('/')
}

export function* UPDATE_PERSONAL_INFO({ payload }) {
  const { accountId, firstName, lastName, contactNumber } = payload
  yield put({
    type: 'user/SET_STATE',
    payload: {
      loading: true,
    },
  })
  const user = yield call(jwt.getLocalUserData)
  const response = yield call(jwt.updatePersonalInfo, accountId, firstName, lastName, contactNumber)
  if (response) {
    const currentUser = createUserObj(response, true, false, checkProfileUpdateRqd(response))
    yield putResolve({
      type: 'user/SET_STATE',
      payload: {
        firstName: currentUser.firstName,
        lastName: currentUser.lastName,
        contactNumber: currentUser.contactNumber,
      },
    })
    if (!isEmpty(user.accessToken)) {
      currentUser.accessToken = user.accessToken
    }
    yield call(jwt.updateLocalUserData, currentUser)
    yield putResolve({
      type: 'user/SET_STATE',
      payload: {
        requiresProfileUpdate: currentUser.requiresProfileUpdate,
      },
    })
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
  const { accountId, updateHeadline, headline, bio } = payload
  yield put({
    type: 'user/SET_STATE',
    payload: {
      loading: true,
    },
  })
  const user = yield call(jwt.getLocalUserData)
  const response = yield call(jwt.updateAbout, accountId, updateHeadline, headline, bio)
  if (response) {
    const currentUser = createUserObj(response, true, false, checkProfileUpdateRqd(response))
    yield putResolve({
      type: 'user/SET_STATE',
      payload: {
        headline: currentUser.headline,
        bio: currentUser.bio,
      },
    })
    if (!isEmpty(user.accessToken)) {
      currentUser.accessToken = user.accessToken
    }
    yield call(jwt.updateLocalUserData, currentUser)
    yield putResolve({
      type: 'user/SET_STATE',
      payload: {
        requiresProfileUpdate: currentUser.requiresProfileUpdate,
      },
    })
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
  const { accountId, isPrivateProfile, emailNotification, chatPrivacy } = payload
  yield put({
    type: 'user/SET_STATE',
    payload: {
      loading: true,
    },
  })
  const user = yield call(jwt.getLocalUserData)
  const response = yield call(
    jwt.updateAccountSettings,
    accountId,
    isPrivateProfile,
    emailNotification,
    chatPrivacy,
  )
  if (response) {
    let currentUser = createUserObj(response, true, false, checkProfileUpdateRqd(response))
    yield putResolve({
      type: 'user/SET_STATE',
      payload: {
        isPrivateProfile: currentUser.isPrivateProfile,
        emailNotification: currentUser.emailNotification,
        chatPrivacy: currentUser.chatPrivacy,
      },
    })
    if (!isEmpty(user.accessToken)) {
      currentUser.accessToken = user.accessToken
    }
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
  const { accountId, isIndustry, industry, occupation } = payload
  yield put({
    type: 'user/SET_STATE',
    payload: {
      loading: true,
    },
  })
  const user = yield call(jwt.getLocalUserData)
  const response = yield call(jwt.updateWorkDetails, accountId, isIndustry, industry, occupation)
  if (response) {
    const currentUser = createUserObj(response, true, false, checkProfileUpdateRqd(response))
    yield putResolve({
      type: 'user/SET_STATE',
      payload: {
        industry: currentUser.industry,
        occupation: currentUser.occupation,
      },
    })
    if (!isEmpty(user.accessToken)) {
      currentUser.accessToken = user.accessToken
    }
    yield call(jwt.updateLocalUserData, currentUser)
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

export function* UPDATE_PERSONALITY({ payload }) {
  const { accountId, personality } = payload
  yield put({
    type: 'user/SET_STATE',
    payload: {
      loading: true,
    },
  })
  const user = yield call(jwt.getLocalUserData)
  const response = yield call(jwt.updatePersonality, accountId, personality)
  if (response) {
    let currentUser = createUserObj(response, true, false, checkProfileUpdateRqd(response))
    yield putResolve({
      type: 'user/SET_STATE',
      payload: {
        personality: currentUser.personality,
      },
    })
    if (!isEmpty(user.accessToken)) {
      currentUser.accessToken = user.accessToken
    }
    yield call(jwt.updateLocalUserData, currentUser)
    currentUser = yield select(selectors.user)
    notification.success({
      message: 'Personality Updated',
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

export function* UPDATE_ADMIN_VERIFIED({ payload }) {
  const { accountId, adminVerified } = payload
  yield put({
    type: 'user/SET_STATE',
    payload: {
      loading: true,
    },
  })
  const user = yield call(jwt.getLocalUserData)
  const response = yield call(jwt.updateAdminVerified, accountId, adminVerified)
  if (response) {
    let currentUser = createUserObj(response, true, false, checkProfileUpdateRqd(response))
    yield putResolve({
      type: 'user/SET_STATE',
      payload: {
        adminVerified: currentUser.adminVerified,
      },
    })
    if (!isEmpty(user.accessToken)) {
      currentUser.accessToken = user.accessToken
    }
    yield call(jwt.updateLocalUserData, currentUser)
    currentUser = yield select(selectors.user)
    notification.success({
      message: 'Your profile was submitted for verification.',
    })
  }
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

export default function* rootSaga() {
  yield all([
    takeEvery(actions.LOGIN, LOGIN),
    takeEvery(actions.REGISTER, REGISTER),
    takeEvery(actions.LOGOUT, LOGOUT),
    takeEvery(actions.CHANGE_PASSWORD, CHANGE_PASSWORD),
    takeEvery(actions.LOAD_CURRENT_ACCOUNT, LOAD_CURRENT_ACCOUNT),
    takeEvery(actions.DELETE_ACCOUNT, DELETE_ACCOUNT),
    takeEvery(actions.UPDATE_PERSONAL_INFO, UPDATE_PERSONAL_INFO),
    takeEvery(actions.UPDATE_ACCOUNT_SETTINGS, UPDATE_ACCOUNT_SETTINGS),
    takeEvery(actions.UPDATE_ABOUT, UPDATE_ABOUT),
    takeEvery(actions.UPDATE_WORK_DETAILS, UPDATE_WORK_DETAILS),
    takeEvery(actions.UPDATE_PERSONALITY, UPDATE_PERSONALITY),
    takeEvery(actions.UPDATE_ADMIN_VERIFIED, UPDATE_ADMIN_VERIFIED),
    takeEvery(actions.ADD_EXPERIENCE, ADD_EXPERIENCE),
    takeEvery(actions.EDIT_EXPERIENCE, EDIT_EXPERIENCE),
    takeEvery(actions.DELETE_EXPERIENCE, DELETE_EXPERIENCE),
    LOAD_CURRENT_ACCOUNT(), // run once on app load to check user auth
  ])
}

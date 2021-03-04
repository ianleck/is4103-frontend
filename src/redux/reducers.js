import { combineReducers } from 'redux'
import { connectRouter } from 'connected-react-router'
import admin from './admin/reducers'
import user from './user/reducers'
import menu from './menu/reducers'
import settings from './settings/reducers'
import categories from './categories/reducers'

export default history =>
  combineReducers({
    router: connectRouter(history),
    admin,
    user,
    menu,
    settings,
    categories,
  })

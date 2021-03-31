import { combineReducers } from 'redux'
import { connectRouter } from 'connected-react-router'
import cart from './cart/reducers'
import categories from './categories/reducers'
import menu from './menu/reducers'
import settings from './settings/reducers'
import social from './social/reducers'
import user from './user/reducers'

export default history =>
  combineReducers({
    router: connectRouter(history),
    cart,
    categories,
    menu,
    settings,
    social,
    user,
  })

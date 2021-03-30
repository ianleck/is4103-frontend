import { combineReducers } from 'redux'
import { connectRouter } from 'connected-react-router'
import cart from './cart/reducers'
import user from './user/reducers'
import menu from './menu/reducers'
import settings from './settings/reducers'
import categories from './categories/reducers'

export default history =>
  combineReducers({
    router: connectRouter(history),
    cart,
    user,
    menu,
    settings,
    categories,
  })

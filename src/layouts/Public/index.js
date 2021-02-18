import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { withRouter } from 'react-router-dom'
import CustomLayout from 'components/Layout/CustomLayout'

const PublicLayout = ({ children }) => {
  const dispatch = useDispatch()
  const currentUser = useSelector(state => state.user)

  const selectMenuLayoutType = () => {
    dispatch({
      type: 'settings/CHANGE_SETTING',
      payload: {
        setting: 'menuLayoutType',
        value: 'top',
      },
    })
  }
  const switchToMainMenu = () => {
    const menuData = [
      {
        title: 'Mentors',
        key: 'mentors',
        icon: 'fa fa-mortar-board',
        url: '/browse/mentors',
      },
      {
        title: 'Courses',
        key: 'courses',
        icon: 'fa fa-cubes',
        url: '/browse/courses',
      },
    ]
    if (currentUser.role === '') {
      menuData.push({
        title: 'I am a Sensei',
        key: 'senseiAccess',
        url: '/sensei',
      })
    } else if (currentUser.role === 'student') {
      menuData.push({
        title: 'My Dashboard',
        key: 'studentDashboardAccess',
        url: '/student/dashboard',
      })
    }
    dispatch({
      type: 'menu/SET_STATE',
      payload: {
        menuData,
      },
    })
  }
  selectMenuLayoutType()
  switchToMainMenu()

  return <CustomLayout isPublic>{children}</CustomLayout>
}

export default withRouter(PublicLayout)

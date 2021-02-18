import React from 'react'
import { withRouter } from 'react-router-dom'
import CustomLayout from 'components/Layout/CustomLayout'
import { useDispatch } from 'react-redux'

const SenseiLayout = ({ children }) => {
  const dispatch = useDispatch()

  const switchMenuLayoutType = () => {
    dispatch({
      type: 'settings/CHANGE_SETTING',
      payload: {
        setting: 'menuLayoutType',
        value: 'left',
      },
    })
    dispatch({
      type: 'settings/CHANGE_SETTING',
      payload: {
        setting: 'isMenuCollapsed',
        value: false,
      },
    })
  }
  const switchToSenseiMenu = () => {
    const menuData = [
      {
        title: 'Mentorship',
        key: 'mentorship',
        icon: 'fe fe-user',
        children: [
          {
            title: 'Review Applications',
            key: 'reviewApplications',
            url: '/sensei/reviewApplications',
          },
          {
            title: 'Mentee Overview',
            key: 'menteeOverview',
            url: '/sensei/menteeOverview',
          },
          {
            title: 'Tasks',
            key: 'tasks',
            url: '/sensei/tasks',
          },
          {
            title: 'Testimonials',
            key: 'testimonials',
            url: '/sensei/testimonials',
          },
          {
            title: 'Chat/Video Call',
            key: 'chatVideoCall',
            url: '/sensei/chatVideoCall',
          },
        ],
      },
      {
        title: 'Courses',
        key: 'courses',
        icon: 'fe fe-layers',
        children: [
          {
            title: 'Courses',
            key: 'courses',
            url: '/sensei/courses',
          },
          {
            title: 'Announcements',
            key: 'announcements',
            url: '/sensei/announcements',
          },
        ],
      },
      {
        title: 'Profile',
        key: 'profile',
        icon: 'fe fe-user',
        children: [
          {
            title: 'Mentor Feed',
            key: 'mentorFeed',
            url: '/sensei/mentorFeed',
          },
          {
            title: 'My Profile',
            key: 'myProfile',
            url: '/sensei/myProfile',
          },
        ],
      },
      {
        title: 'Sales',
        key: 'sales',
        icon: 'fe fe-shopping-cart',
        children: [
          {
            title: 'Statistics',
            key: 'statistics',
            url: '/sensei/statistics',
          },
          {
            title: 'My Wallet',
            key: 'myWallet',
            url: '/sensei/myWallet',
          },
        ],
      },
    ]
    dispatch({
      type: 'menu/SET_STATE',
      payload: {
        menuData,
      },
    })
  }
  switchMenuLayoutType()
  switchToSenseiMenu()

  return <CustomLayout isPublic={false}>{children}</CustomLayout>
}

export default withRouter(SenseiLayout)

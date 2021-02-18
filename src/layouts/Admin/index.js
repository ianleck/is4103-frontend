import CustomLayout from 'components/Layout/CustomLayout'
import React from 'react'
import { useDispatch } from 'react-redux'
import { withRouter } from 'react-router-dom'

const AdminLayout = ({ children }) => {
  const dispatch = useDispatch()

  const switchMenuLayoutType = () => {
    dispatch({
      type: 'settings/CHANGE_SETTING',
      payload: {
        setting: 'menuLayoutType',
        value: 'left',
      },
    })
  }
  const switchToAdminMenu = () => {
    const menuData = [
      {
        title: 'Users Management',
        key: 'userManagement',
        icon: 'fe fe-users',
        children: [
          {
            title: 'Users',
            key: 'userManagement',
            url: '/admin/user-management',
          },
          {
            title: 'Admin',
            key: 'adminManagement',
            url: '/admin/admin-management',
          },
        ],
      },
      {
        title: 'Business Management',
        key: 'businessManagement',
        icon: 'fe fe-printer',
        children: [
          {
            title: 'Revenue',
            key: 'revenue',
            url: '/admin/revenue-management',
          },
          {
            title: 'Profit',
            key: 'profit',
            url: '/admin/profit',
          },
          {
            title: 'User Statistics',
            key: 'userStatistics',
            url: '/admin/user-statistics',
          },
        ],
      },
      {
        title: 'Content Management',
        key: 'contentManagement',
        icon: 'fe fe-music',
        children: [
          {
            title: 'Sensei',
            key: 'senseiContent',
            url: '/admin/sensei-content-management',
          },
          {
            title: 'Courses',
            key: 'courseContent',
            url: '/admin/course-content-management',
          },
          {
            title: 'Announcements',
            key: 'announcementContent',
            url: '/admin/announcement-content-management',
          },
          {
            title: 'Complaints',
            key: 'complaintContent',
            url: '/admin/complaint-content-management',
          },
        ],
      },
      {
        title: 'Finance Management',
        key: 'financeManagement',
        icon: 'fe fe-thermometer',
        children: [
          {
            title: 'Withdrawals',
            key: 'withdrawals',
            url: '/admin/withdrawals',
          },
          {
            title: 'Refunds',
            key: 'refunds',
            url: '/admin/refunds',
          },
          {
            title: 'Transactions',
            key: 'transactions',
            url: '/admin/transactions',
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
  switchToAdminMenu()

  return <CustomLayout isPublic={false}>{children}</CustomLayout>
}

export default withRouter(AdminLayout)

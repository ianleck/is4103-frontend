import React from 'react'
import { Layout } from 'antd'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import classNames from 'classnames'
import Breadcrumbs from 'components/cleanui/layout/Breadcrumbs'
import AdminMenuBar from 'components/Admin/AdminMenuBar'
import Menu from 'components/cleanui/layout/Menu'
import Footer from 'components/cleanui/layout/Footer'

const mapStateToProps = ({ settings }) => ({
  isContentMaxWidth: settings.isContentMaxWidth,
  isAppMaxWidth: settings.isAppMaxWidth,
  isGrayBackground: settings.isGrayBackground,
  isSquaredBorders: settings.isSquaredBorders,
  isCardShadow: settings.isCardShadow,
  isBorderless: settings.isBorderless,
  isTopbarFixed: settings.isTopbarFixed,
  isGrayTopbar: settings.isGrayTopbar,
})

const Admin = ({
  children,
  dispatch,
  isContentMaxWidth,
  isAppMaxWidth,
  isGrayBackground,
  isSquaredBorders,
  isCardShadow,
  isBorderless,
  isTopbarFixed,
  isGrayTopbar,
}) => {
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
            url: '/admin/userManagement',
          },
          {
            title: 'Admin',
            key: 'adminManagement',
            url: '/admin/adminManagement',
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
            url: '/admin/revenueManagement',
          },
          {
            title: 'Profit',
            key: 'profit',
            url: '/admin/profit',
          },
          {
            title: 'User Statistics',
            key: 'userStatistics',
            url: '/admin/userStatistics',
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
            url: '/admin/senseiContentManagement',
          },
          {
            title: 'Courses',
            key: 'courseContent',
            url: '/admin/courseContentManagement',
          },
          {
            title: 'Announcements',
            key: 'announcementContent',
            url: '/admin/announcementContentManagement',
          },
          {
            title: 'Complaints',
            key: 'complaintContent',
            url: '/admin/complaintContentManagement',
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
  return (
    <div className={classNames({ cui__layout__grayBackground: isGrayBackground })}>
      <Layout
        className={classNames({
          cui__layout__contentMaxWidth: isContentMaxWidth,
          cui__layout__appMaxWidth: isAppMaxWidth,
          cui__layout__grayBackground: isGrayBackground,
          cui__layout__squaredBorders: isSquaredBorders,
          cui__layout__cardsShadow: isCardShadow,
          cui__layout__borderless: isBorderless,
        })}
      >
        <Menu />
        <Layout>
          <Layout.Header
            className={classNames('cui__layout__header', {
              cui__layout__fixedHeader: isTopbarFixed,
              cui__layout__headerGray: isGrayTopbar,
            })}
          >
            <AdminMenuBar />
          </Layout.Header>
          <Breadcrumbs />
          <Layout.Content style={{ height: '100%', position: 'relative' }}>
            <div className="cui__utils__content">{children}</div>
          </Layout.Content>
          <Layout.Footer>
            <Footer />
          </Layout.Footer>
        </Layout>
      </Layout>
    </div>
  )
}

export default withRouter(connect(mapStateToProps)(Admin))

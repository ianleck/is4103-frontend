import React from 'react'
import { Layout } from 'antd'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import classNames from 'classnames'
import SenseiMenuBar from 'components/Sensei/SenseiMenuBar'
import Menu from 'components/cleanui/layout/Menu'

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

const Sensei = ({
  children,
  dispatch,
  isContentMaxWidth,
  isAppMaxWidth,
  isGrayBackground,
  isSquaredBorders,
  isCardShadow,
  isBorderless,
}) => {
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
          <Layout.Content style={{ height: '100%', position: 'relative' }}>
            <SenseiMenuBar />
            <div className="cui__utils__content">{children}</div>
          </Layout.Content>
        </Layout>
      </Layout>
    </div>
  )
}

export default withRouter(connect(mapStateToProps)(Sensei))

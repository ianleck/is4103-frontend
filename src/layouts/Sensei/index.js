import React from 'react'
import { Layout } from 'antd'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import classNames from 'classnames'
import SenseiMenuBar from 'components/SenseiMenuBar'
import Menu from 'components/cleanui/layout/Menu'
import SupportChat from 'components/cleanui/layout/SupportChat'

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
  }
  const switchToSenseiMenu = () => {
    const menuData = [
      {
        category: true,
        title: 'Appss & Pages',
      },
      {
        title: 'Apps',
        key: 'apps',
        icon: 'fe fe-database',
        children: [
          {
            title: 'Profile',
            key: 'appsProfile',
            url: '/apps/profile',
          },
          {
            title: 'Calendar',
            key: 'appsCalendar',
            url: '/apps/calendar',
          },
          {
            title: 'Gallery',
            key: 'appsGallery',
            url: '/apps/gallery',
          },
          {
            title: 'Messaging',
            key: 'appsCart',
            url: '/apps/messaging',
          },
          {
            title: 'Mail',
            key: 'appsMail',
            url: '/apps/mail',
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
        <SupportChat />
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

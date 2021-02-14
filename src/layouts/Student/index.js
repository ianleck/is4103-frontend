import React from 'react'
import { Layout } from 'antd'
import { connect } from 'react-redux'
import { withRouter, useLocation } from 'react-router-dom'
import classNames from 'classnames'
import CategoriesBar from 'components/Public/PublicCategoriesBar'
import StudentDashboardMenuBar from 'components/Student/StudentDashboardSubMenuBar'
import Breadcrumbs from 'components/cleanui/layout/Breadcrumbs'
import StudentMenuBar from 'components/Student/StudentMenuBar'
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

const Student = ({
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
        url: '/student/browse/mentors',
      },
      {
        title: 'Courses',
        key: 'courses',
        icon: 'fa fa-cubes',
        url: '/student/browse/courses',
      },
      {
        title: 'My Dashboard',
        key: 'studentAccess',
        url: '/student/dashboard',
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
  switchToMainMenu()
  const { pathname } = useLocation()
  if (pathname === '/student/dashboard' || pathname === '/student/profile') {
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
          <StudentMenuBar />
          <Layout>
            <Layout.Header
              className={classNames('cui__layout__header', {
                cui__layout__fixedHeader: isTopbarFixed,
                cui__layout__headerGray: isGrayTopbar,
              })}
            >
              <StudentDashboardMenuBar />
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
        <StudentMenuBar />
        <Layout>
          <Layout.Header
            className={classNames('cui__layout__header', {
              cui__layout__fixedHeader: isTopbarFixed,
              cui__layout__headerGray: isGrayTopbar,
            })}
          >
            <CategoriesBar />
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

export default withRouter(connect(mapStateToProps)(Student))

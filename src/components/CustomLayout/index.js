import { Layout } from 'antd'
import classNames from 'classnames'
import Menu from 'components/cleanui/layout/Menu'
import PublicCategoriesBar from 'components/Public/PublicCategoriesBar'
import PublicMenuBar from 'components/Public/PublicMenuBar'
import StudentDashboardSubMenuBar from 'components/Student/StudentDashboardSubMenuBar'
import UserGroupTopBar from 'components/UserGroupTopBar'
import React from 'react'
import { connect } from 'react-redux'
import { useLocation, withRouter } from 'react-router-dom'

const CustomLayout = ({
  isContentMaxWidth,
  isAppMaxWidth,
  isGrayBackground,
  isSquaredBorders,
  isCardShadow,
  isBorderless,
  isTopbarFixed,
  isGrayTopbar,
  children,
  isPublic,
}) => {
  const { pathname } = useLocation()
  const showStudentDashboardMenu = /^\/student\/dashboard(?=\/|$)/i.test(pathname)
  const showCategories =
    /^\/mentorships(?=\/|$)/i.test(pathname) || /^\/courses(?=\/|$)/i.test(pathname)

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
        {isPublic ? <PublicMenuBar /> : <Menu />}
        <Layout>
          {(showCategories || showStudentDashboardMenu || !isPublic) && (
            <Layout.Header
              className={classNames('cui__layout__header', {
                cui__layout__fixedHeader: isTopbarFixed,
                cui__layout__headerGray: isGrayTopbar,
              })}
            >
              {!!isPublic && showCategories && <PublicCategoriesBar />}
              {!!isPublic && showStudentDashboardMenu && <StudentDashboardSubMenuBar />}
              {!isPublic && <UserGroupTopBar />}
            </Layout.Header>
          )}
          <Layout.Content style={{ height: '100%', position: 'relative' }}>
            <div className="cui__utils__content">{children}</div>
          </Layout.Content>
        </Layout>
      </Layout>
    </div>
  )
}

const mapStateToProps = ({ settings, user }) => ({
  isContentMaxWidth: settings.isContentMaxWidth,
  isAppMaxWidth: settings.isAppMaxWidth,
  isGrayBackground: settings.isGrayBackground,
  isSquaredBorders: settings.isSquaredBorders,
  isCardShadow: settings.isCardShadow,
  isBorderless: settings.isBorderless,
  isTopbarFixed: settings.isTopbarFixed,
  isGrayTopbar: settings.isGrayTopbar,
  currentUser: user,
})

export default withRouter(connect(mapStateToProps)(CustomLayout))

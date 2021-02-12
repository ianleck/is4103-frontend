import React, { Fragment } from 'react'
import { withRouter, Redirect } from 'react-router-dom'
import { connect } from 'react-redux'
import NProgress from 'nprogress'
import { Helmet } from 'react-helmet'
// import Loader from 'components/cleanui/layout/Loader'
import PublicLayout from './Public'
import AuthLayout from './Auth'
import MainLayout from './Main'
import MenuLeftLayout from './MenuLeft'
import MenuTopLayout from './MenuTop'

const Layouts = {
  public: PublicLayout,
  auth: AuthLayout,
  main: MainLayout,
  menuLeft: MenuLeftLayout,
  menuTop: MenuTopLayout,
}

const mapStateToProps = ({ user }) => ({ user })
let previousPath = ''

const Layout = ({ user, children, location: { pathname, search } }) => {
  // NProgress & ScrollTop Management
  const currentPath = pathname + search
  if (currentPath !== previousPath) {
    window.scrollTo(0, 0)
    NProgress.start()
  }
  setTimeout(() => {
    NProgress.done()
    previousPath = currentPath
  }, 300)

  // Layout Rendering
  const getLayout = () => {
    if (pathname === '/') {
      return 'public'
    }
    if (/^\/admin(?=\/|$)/i.test(pathname) || /^\/sensei(?=\/|$)/i.test(pathname)) {
      return 'menuLeft'
    }
    if (/^\/student(?=\/|$)/i.test(pathname)) {
      return 'menuTop'
    }
    if (/^\/auth(?=\/|$)/i.test(pathname)) {
      return 'auth'
    }
    return 'main'
  }

  const Container = Layouts[getLayout()]
  const isUserAuthorized = user.authorized
  const isUserLoading = user.loading
  const isAuthLayout = getLayout() === 'auth'

  const BootstrappedLayout = () => {
    // show loader when user in check authorization process, not authorized yet and not on login pages
    if (isUserLoading && !isUserAuthorized && !isAuthLayout) {
      return null
    }
    if (
      (!isUserAuthorized && /^\/admin(?=\/|$)/i.test(pathname)) ||
      /^\/sensei(?=\/|$)/i.test(pathname) ||
      /^\/student(?=\/|$)/i.test(pathname)
    ) {
      return <Redirect to="/auth/login" />
    }
    // in other case render previously set layout
    return <Container>{children}</Container>
  }

  return (
    <Fragment>
      <Helmet titleTemplate="Clean UI Pro React | %s" title="React Admin Template" />
      {BootstrappedLayout()}
    </Fragment>
  )
}

export default withRouter(connect(mapStateToProps)(Layout))

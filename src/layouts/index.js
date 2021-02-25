import React, { Fragment } from 'react'
import { useSelector } from 'react-redux'
import { withRouter, Redirect } from 'react-router-dom'
import NProgress from 'nprogress'
import { Helmet } from 'react-helmet'
// import Loader from 'components/cleanui/layout/Loader'
import { USER_TYPE_ENUM } from 'constants/constants'
import PublicLayout from './Public'
import AuthLayout from './Auth'
import MainLayout from './Main'
import AdminLayout from './Admin'
import SenseiLayout from './Sensei'

const Layouts = {
  public: PublicLayout,
  auth: AuthLayout,
  main: MainLayout,
  admin: AdminLayout,
  sensei: SenseiLayout,
}

let previousPath = ''

const Layout = ({ children, location: { pathname, search } }) => {
  const user = useSelector(state => state.user)
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
    if (
      RegExp('login').test(pathname) ||
      RegExp('register').test(pathname) ||
      /^\/auth(?=\/|$)/i.test(pathname)
    ) {
      return 'auth'
    }
    if (/^\/admin(?=\/|$)/i.test(pathname)) {
      return 'admin'
    }
    if (/^\/sensei(?=\/|$)/i.test(pathname)) {
      return 'sensei'
    }
    if (/^\/student(?=\/|$)/i.test(pathname)) {
      return 'public'
    }
    return 'public'
  }

  const Container = Layouts[getLayout()]
  const isUserAuthorized = user.authorized
  const isUserLoading = user.loading
  const isAuthLayout = getLayout() === 'auth'

  const BootstrappedLayout = () => {
    if (isUserAuthorized) {
      if (
        (/^\/admin(?=\/|$)/i.test(pathname) && user.userType !== USER_TYPE_ENUM.ADMIN) ||
        (/^\/sensei(?=\/|$)/i.test(pathname) && user.userType !== USER_TYPE_ENUM.SENSEI)
      )
        return <Redirect to="/auth/login" />
    } else {
      if (isUserLoading && !isUserAuthorized && !isAuthLayout) {
        // show loader when user in check authorization process, not authorized yet and not on login pages
        return null
      }
      if (/^\/admin(?=\/|$)/i.test(pathname)) {
        return <Redirect to="/auth/admin" />
      }
      if (/^\/sensei(?=\/|$)/i.test(pathname) || /^\/student(?=\/|$)/i.test(pathname)) {
        return <Redirect to="/auth/login" />
      }
    }
    return <Container>{children}</Container>
  }

  return (
    <Fragment>
      <Helmet titleTemplate="Digi Dojo | %s" title="Mentorship Platform" />
      {BootstrappedLayout()}
    </Fragment>
  )
}

export default withRouter(Layout)

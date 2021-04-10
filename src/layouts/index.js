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
  const settings = useSelector(state => state.settings)
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
    /*
    Cases:
    1. No auth -> Go to /auth/login
    2. No auth but tries to go /admin -> Go to /auth/admin
    3. No auth but tries to go /auth/login -> Load <Container>{children}</Container>
    Auth:
    4A. Student tries to go /admin or /sensei -> Go to /auth/login (helper to redirect)
    4B. Sensei tries to go /admin or /student -> Go to /auth/login (helper to redirect)
    4C. Admin tries to go /sensei or /student -> Go to /auth/login (helper to redirect)
    */
    if (isUserLoading && !isUserAuthorized && !isAuthLayout) {
      return null
    }

    if (
      !isUserAuthorized ||
      (user.userType !== USER_TYPE_ENUM.SENSEI && /^\/sensei(?=\/|$)/i.test(pathname)) ||
      (user.userType !== USER_TYPE_ENUM.ADMIN && /^\/admin(?=\/|$)/i.test(pathname))
    ) {
      if (
        isUserAuthorized ||
        (!isUserAuthorized &&
          (/^\/sensei(?=\/|$)/i.test(pathname) ||
            /^\/student(?=\/|$)/i.test(pathname) ||
            /^\/social(?=\/|$)/i.test(pathname)))
      ) {
        settings.rememberPath = pathname
        return <Redirect to="/auth/login" />
      }
      if (!isUserAuthorized && /^\/admin(?=\/|$)/i.test(pathname))
        return <Redirect to="/auth/admin" />
    }

    return <Container>{children}</Container>

    /* 
    This is the old version of the redirecting that also works.
    It should be more readable but of course, the redirect part is repeated.
    */
    // if (isUserAuthorized) {
    //   if (
    //     (/^\/admin(?=\/|$)/i.test(pathname) && user.userType !== USER_TYPE_ENUM.ADMIN) ||
    //     (/^\/sensei(?=\/|$)/i.test(pathname) && user.userType !== USER_TYPE_ENUM.SENSEI)
    //   ) {
    //     return <Redirect to="/auth/login" />
    //   }
    // } else {
    //   if (isUserLoading && !isAuthLayout) {
    //     // show loader when user in check authorization process, not authorized yet and not on login pages
    //     return null
    //   }
    //   if (/^\/admin(?=\/|$)/i.test(pathname)) {
    //     return <Redirect to="/auth/admin" />
    //   }
    //   if (/^\/sensei(?=\/|$)/i.test(pathname) || /^\/student(?=\/|$)/i.test(pathname)) {
    //     return <Redirect to="/auth/login" />
    //   }
    // }
    // return <Container>{children}</Container>
  }

  return (
    <Fragment>
      <Helmet titleTemplate="Digi Dojo | %s" title="Mentorship Platform" />
      {BootstrappedLayout()}
    </Fragment>
  )
}

export default withRouter(Layout)

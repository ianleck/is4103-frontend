import React, { Fragment } from 'react'
import { withRouter, Redirect } from 'react-router-dom'
import { connect } from 'react-redux'
import NProgress from 'nprogress'
import { Helmet } from 'react-helmet'
// import Loader from 'components/cleanui/layout/Loader'
import PublicLayout from './Public'
import AuthLayout from './Auth'
import MainLayout from './Main'
import AdminLayout from './Admin'
import SenseiLayout from './Sensei'
import StudentLayout from './Student'

const Layouts = {
  public: PublicLayout,
  auth: AuthLayout,
  main: MainLayout,
  admin: AdminLayout,
  sensei: SenseiLayout,
  student: StudentLayout,
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
    if (/^\/admin(?=\/|$)/i.test(pathname)) {
      return 'admin'
    }
    if (/^\/sensei(?=\/|$)/i.test(pathname)) {
      return 'sensei'
    }
    if (/^\/student(?=\/|$)/i.test(pathname)) {
      return 'student'
    }
    if (/^\/auth(?=\/|$)/i.test(pathname)) {
      return 'auth'
    }
    return 'public'
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
      !isUserAuthorized &&
      (/^\/admin(?=\/|$)/i.test(pathname) ||
        /^\/sensei(?=\/|$)/i.test(pathname) ||
        /^\/student(?=\/|$)/i.test(pathname))
    ) {
      return <Redirect to="/auth/login" />
    }
    // in other case render previously set layout
    return <Container>{children}</Container>
  }

  return (
    <Fragment>
      <Helmet titleTemplate="Digi Dojo | %s" title="Mentorship Platform" />
      {BootstrappedLayout()}
    </Fragment>
  )
}

export default withRouter(connect(mapStateToProps)(Layout))

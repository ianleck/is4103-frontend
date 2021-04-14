import React, { lazy, Suspense } from 'react'
import { Route, Redirect, Switch } from 'react-router-dom'
import { ConnectedRouter } from 'connected-react-router'
import { CSSTransition, SwitchTransition } from 'react-transition-group'
import { connect } from 'react-redux'

import Layout from 'layouts'

const routes = [
  // Common Pages
  {
    path: '/',
    Component: lazy(() => import('pages/')),
    exact: true,
  },
  {
    path: '/browse',
    Component: lazy(() => import('pages/browse')),
    exact: true,
  },
  {
    path: '/mentorships',
    Component: lazy(() => import('pages/mentorships')),
    exact: true,
  },
  {
    path: '/mentorships/category/:categoryId',
    Component: lazy(() => import('pages/mentorships')),
    exact: true,
  },
  {
    path: '/courses',
    Component: lazy(() => import('pages/courses')),
    exact: true,
  },
  {
    path: '/courses/category/:categoryId',
    Component: lazy(() => import('pages/courses')),
    exact: true,
  },
  {
    path: '/courses/:id',
    Component: lazy(() => import('pages/courses/view')),
    exact: true,
  },
  {
    path: '/cart',
    Component: lazy(() => import('pages/cart')),
    exact: true,
  },
  {
    path: '/success',
    Component: lazy(() => import('pages/checkout/success')),
    exact: true,
  },
  {
    path: '/err',
    Component: lazy(() => import('pages/checkout/failed')),
    exact: true,
  },
  {
    path: '/social/feed',
    Component: lazy(() => import('pages/social/feed')),
    exact: true,
  },
  {
    path: '/social/profile/:accountId',
    Component: lazy(() => import('pages/social/profile')),
    exact: true,
  },
  {
    path: '/social/post/:postId',
    Component: lazy(() => import('pages/social/post')),
    exact: true,
  },
  // Auth Pages
  {
    path: '/auth/login',
    Component: lazy(() => import('pages/auth/login')),
    exact: true,
  },
  {
    path: '/auth/admin',
    Component: lazy(() => import('pages/auth/admin-login')),
    exact: true,
  },
  {
    path: '/auth/forgot-password',
    Component: lazy(() => import('pages/auth/forgot-password')),
    exact: true,
  },
  {
    path: '/auth/reset-password',
    Component: lazy(() => import('pages/auth/reset-password')),
    exact: true,
  },
  {
    path: '/auth/register',
    Component: lazy(() => import('pages/auth/register')),
    exact: true,
  },
  {
    path: '/auth/register-sensei',
    Component: lazy(() => import('pages/auth/register-sensei')),
    exact: true,
  },
  {
    path: '/auth/lockscreen',
    Component: lazy(() => import('pages/auth/lockscreen')),
    exact: true,
  },
  {
    path: '/auth/404',
    Component: lazy(() => import('pages/auth/404')),
    exact: true,
  },
  {
    path: '/auth/500',
    Component: lazy(() => import('pages/auth/500')),
    exact: true,
  },
  // Admin Pages
  {
    path: '/admin',
    Component: lazy(() => import('pages/admin/dashboard')),
    exact: true,
  },
  {
    path: '/admin/dashboard',
    Component: lazy(() => import('pages/admin/dashboard')),
    exact: true,
  },
  {
    path: '/admin/profile',
    Component: lazy(() => import('pages/admin/profiles')),
    exact: true,
  },
  {
    path: '/admin/user-management',
    Component: lazy(() => import('pages/admin/users')),
    exact: true,
  },
  {
    path: '/admin/user-management/student/:userId',
    Component: lazy(() => import('pages/admin/users/student-profile')),
    exact: true,
  },
  {
    path: '/admin/user-management/sensei/:userId',
    Component: lazy(() => import('pages/admin/users/sensei-profile')),
    exact: true,
  },
  {
    path: '/admin/admin-management',
    Component: lazy(() => import('pages/admin/admins')),
    exact: true,
  },
  {
    path: '/admin/admin-management/add-admin',
    Component: lazy(() => import('pages/admin/admins/add-new-admin')),
    exact: true,
  },
  {
    path: '/admin/admin-management/admin/:adminId',
    Component: lazy(() => import('pages/admin/admins/another-admin-profile')),
    exact: true,
  },
  {
    path: '/admin/revenue-management',
    Component: lazy(() => import('pages/admin/revenue')),
    exact: true,
  },
  {
    path: '/admin/profit',
    Component: lazy(() => import('pages/admin/profits')),
    exact: true,
  },
  {
    path: '/admin/user-statistics',
    Component: lazy(() => import('pages/admin/user-statistics')),
    exact: true,
  },
  {
    path: '/admin/mentorship-content-management',
    Component: lazy(() => import('pages/admin/mentorship')),
    exact: true,
  },
  {
    path: '/admin/course-content-management',
    Component: lazy(() => import('pages/admin/courses')),
    exact: true,
  },
  {
    path: '/admin/course-content-management/:id',
    Component: lazy(() => import('pages/admin/courses/view')),
    exact: true,
  },
  {
    path: '/admin/course-content-management/:courseId/view-lesson/:lessonId',
    Component: lazy(() => import('pages/admin/courses/view-lesson')),
    exact: true,
  },
  {
    path: '/admin/announcement-content-management',
    Component: lazy(() => import('pages/admin/announcements')),
    exact: true,
  },
  {
    path: '/admin/complaint-content-management',
    Component: lazy(() => import('pages/admin/complaints')),
    exact: true,
  },
  {
    path: '/admin/withdrawals',
    Component: lazy(() => import('pages/admin/withdrawals')),
    exact: true,
  },
  {
    path: '/admin/refunds',
    Component: lazy(() => import('pages/admin/refunds')),
    exact: true,
  },
  {
    path: '/admin/billings',
    Component: lazy(() => import('pages/billings')),
    exact: true,
  },
  {
    path: '/admin/billing/view/:id',
    Component: lazy(() => import('pages/billings/view')),
    exact: true,
  },
  {
    path: '/admin/wallets',
    Component: lazy(() => import('pages/admin/wallets')),
    exact: true,
  },
  {
    path: '/admin/social/profile/:accountId',
    Component: lazy(() => import('pages/social/profile')),
    exact: true,
  },
  // Sensei Pages
  {
    path: '/sensei',
    Component: lazy(() => import('pages/sensei/dashboard')),
    exact: true,
  },
  {
    path: '/sensei/dashboard',
    Component: lazy(() => import('pages/sensei/dashboard')),
    exact: true,
  },
  {
    path: '/sensei/profile',
    Component: lazy(() => import('pages/sensei/profile')),
    exact: true,
  },
  {
    path: '/sensei/settings',
    Component: lazy(() => import('pages/sensei/settings')),
    exact: true,
  },
  {
    path: '/sensei/courses',
    Component: lazy(() => import('pages/sensei/courses')),
    exact: true,
  },
  {
    path: '/sensei/courses/create/:id',
    Component: lazy(() => import('pages/sensei/courses/create')),
    exact: true,
  },
  {
    path: '/sensei/courses/create',
    Component: lazy(() => import('pages/sensei/courses/create')),
    exact: true,
  },
  {
    path: '/sensei/courses/view/:id',
    Component: lazy(() => import('pages/student/dashboard/courses/view')),
    exact: true,
  },
  {
    path: '/sensei/courses/:courseId/view-lesson/:lessonId',
    Component: lazy(() => import('pages/student/dashboard/courses/view-lesson')),
    exact: true,
  },
  {
    path: '/sensei/mentorships/',
    Component: lazy(() => import('pages/sensei/mentorships')),
    exact: true,
  },
  {
    path: '/sensei/mentorships/applications',
    Component: lazy(() => import('pages/sensei/mentorships/applications')),
    exact: true,
  },
  {
    path: '/sensei/mentorships/contracts',
    Component: lazy(() => import('pages/sensei/mentorships/contracts')),
    exact: true,
  },
  {
    path: '/sensei/mentees',
    Component: lazy(() => import('pages/sensei/mentees')),
    exact: true,
  },
  {
    path: '/sensei/social/feed',
    Component: lazy(() => import('pages/social/feed')),
    exact: true,
  },
  {
    path: '/sensei/social/profile/:accountId',
    Component: lazy(() => import('pages/social/profile')),
    exact: true,
  },
  {
    path: '/sensei/social/post/:postId',
    Component: lazy(() => import('pages/social/post')),
    exact: true,
  },
  {
    path: '/sensei/wallet',
    Component: lazy(() => import('pages/billings')),
    exact: true,
  },
  {
    path: '/sensei/billing/view/:id',
    Component: lazy(() => import('pages/billings/view')),
    exact: true,
  },
  {
    path: '/sensei/testimonials',
    Component: lazy(() => import('pages/sensei/testimonials/testimonial-management')),
    exact: true,
  },
  {
    path: '/sensei/testimonial/:mentorshipContractId/:accountId',
    Component: lazy(() => import('pages/sensei/testimonials')),
    exact: true,
  },
  // Student Pages
  {
    path: '/student',
    Component: lazy(() => import('pages/student/dashboard')),
    exact: true,
  },
  {
    path: '/student/dashboard',
    Component: lazy(() => import('pages/student/dashboard')),
    exact: true,
  },
  {
    path: '/student/dashboard/courses',
    Component: lazy(() => import('pages/student/dashboard/courses')),
    exact: true,
  },
  {
    path: '/student/dashboard/courses/:id',
    Component: lazy(() => import('pages/student/dashboard/courses/view')),
    exact: true,
  },
  {
    path: '/student/dashboard/courses/:courseId/view-lesson/:lessonId',
    Component: lazy(() => import('pages/student/dashboard/courses/view-lesson')),
    exact: true,
  },
  {
    path: '/student/profile',
    Component: lazy(() => import('pages/student/profile')),
    exact: true,
  },
  {
    path: '/student/settings',
    Component: lazy(() => import('pages/student/settings')),
    exact: true,
  },
  {
    path: '/student/mentorship/view/:id',
    Component: lazy(() => import('pages/student/mentorships/view')),
    exact: true,
  },
  {
    path: '/student/mentorship/apply/:id',
    Component: lazy(() => import('pages/student/mentorships/apply')),
    exact: true,
  },
  {
    path: '/student/dashboard/mentorship/subscription/:id',
    Component: lazy(() => import('pages/student/dashboard/mentorships/mentorship-subscription')),
    exact: true,
  },
  {
    path: '/student/dashboard/mentorship-applications',
    Component: lazy(() => import('pages/student/dashboard/mentorship-applications')),
    exact: true,
  },
  {
    path: '/student/dashboard/mentorship-contracts',
    Component: lazy(() => import('pages/student/dashboard/mentorship-contracts')),
    exact: true,
  },
  {
    path: '/student/dashboard/mentorships',
    Component: lazy(() => import('pages/student/dashboard/mentorships')),
    exact: true,
  },
  {
    path: '/student/dashboard/billings',
    Component: lazy(() => import('pages/billings')),
    exact: true,
  },
  {
    path: '/student/dashboard/billing/view/:id',
    Component: lazy(() => import('pages/billings/view')),
    exact: true,
  },
  {
    path: '/student/dashboard/testimonials',
    Component: lazy(() => import('pages/student/dashboard/testimonials')),
    exact: true,
  },
]

const mapStateToProps = ({ settings }) => ({
  routerAnimation: settings.routerAnimation,
})

const Router = ({ history, routerAnimation }) => {
  return (
    <ConnectedRouter history={history}>
      <Layout>
        <Route
          render={state => {
            const { location } = state
            return (
              <SwitchTransition>
                <CSSTransition
                  key={location.pathname}
                  appear
                  classNames={routerAnimation}
                  timeout={routerAnimation === 'none' ? 0 : 300}
                >
                  <Switch location={location}>
                    {routes.map(({ path, Component, exact }) => (
                      <Route
                        path={path}
                        key={path}
                        exact={exact}
                        render={() => {
                          return (
                            <div className={routerAnimation}>
                              <Suspense fallback={null}>
                                <Component />
                              </Suspense>
                            </div>
                          )
                        }}
                      />
                    ))}
                    <Redirect to="/auth/404" />
                  </Switch>
                </CSSTransition>
              </SwitchTransition>
            )
          }}
        />
      </Layout>
    </ConnectedRouter>
  )
}

export default connect(mapStateToProps)(Router)

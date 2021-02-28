import React, { lazy, Suspense } from 'react'
import { Route, Redirect, Switch } from 'react-router-dom'
import { ConnectedRouter } from 'connected-react-router'
import { CSSTransition, SwitchTransition } from 'react-transition-group'
import { connect } from 'react-redux'

import Layout from 'layouts'

const routes = [
  // Landing Pages
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
    Component: lazy(() => import('pages/admin/profiles/admin-profile')),
    exact: true,
  },
  {
    path: '/admin/user-management',
    Component: lazy(() => import('pages/admin/users/main')),
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
    path: '/admin/user-management/verify-senseis',
    Component: lazy(() => import('pages/admin/verify-mentor/verify-mentors')),
    exact: true,
  },
  {
    path: '/admin/user-management/verify-senseis/:mentorId',
    Component: lazy(() => import('pages/admin/verify-mentor/mentor-page')),
    exact: true,
  },
  {
    path: '/admin/admin-management',
    Component: lazy(() => import('pages/admin/admins/main')),
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
    Component: lazy(() => import('pages/admin/mentorship/main')),
    exact: true,
  },
  {
    path: '/admin/course-content-management',
    Component: lazy(() => import('pages/admin/courses')),
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
    path: '/admin/transactions',
    Component: lazy(() => import('pages/admin/transactions')),
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
    path: '/student/profile',
    Component: lazy(() => import('pages/student/profile')),
    exact: true,
  },
  {
    path: '/student/settings',
    Component: lazy(() => import('pages/student/settings')),
    exact: true,
  },
  /*


  SAMPLE PAGES
  
  
  */
  // Dashboards
  {
    path: '/dashboard/alpha',
    Component: lazy(() => import('pages/dashboard/alpha')),
    exact: true,
  },
  {
    path: '/dashboard/beta',
    Component: lazy(() => import('pages/dashboard/beta')),
    exact: true,
  },
  {
    path: '/dashboard/gamma',
    Component: lazy(() => import('pages/dashboard/gamma')),
    exact: true,
  },
  {
    path: '/dashboard/crypto',
    Component: lazy(() => import('pages/dashboard/crypto')),
    exact: true,
  },

  // Ecommerce
  {
    path: '/ecommerce/dashboard',
    Component: lazy(() => import('pages/ecommerce/dashboard')),
    exact: true,
  },
  {
    path: '/ecommerce/orders',
    Component: lazy(() => import('pages/ecommerce/orders')),
    exact: true,
  },
  {
    path: '/ecommerce/product-catalog',
    Component: lazy(() => import('pages/ecommerce/product-catalog')),
    exact: true,
  },
  {
    path: '/ecommerce/product-details',
    Component: lazy(() => import('pages/ecommerce/product-details')),
    exact: true,
  },
  {
    path: '/ecommerce/cart',
    Component: lazy(() => import('pages/ecommerce/cart')),
    exact: true,
  },

  // Apps
  {
    path: '/apps/messaging',
    Component: lazy(() => import('pages/apps/messaging')),
    exact: true,
  },
  {
    path: '/apps/calendar',
    Component: lazy(() => import('pages/apps/calendar')),
    exact: true,
  },
  {
    path: '/apps/mail',
    Component: lazy(() => import('pages/apps/mail')),
    exact: true,
  },
  {
    path: '/apps/profile',
    Component: lazy(() => import('pages/apps/profile')),
    exact: true,
  },
  {
    path: '/apps/gallery',
    Component: lazy(() => import('pages/apps/gallery')),
    exact: true,
  },
  // Extra Apps
  {
    path: '/apps/github-explore',
    Component: lazy(() => import('pages/apps/github-explore')),
    exact: true,
  },
  {
    path: '/apps/github-discuss',
    Component: lazy(() => import('pages/apps/github-discuss')),
    exact: true,
  },
  {
    path: '/apps/digitalocean-droplets',
    Component: lazy(() => import('pages/apps/digitalocean-droplets')),
    exact: true,
  },
  {
    path: '/apps/digitalocean-create',
    Component: lazy(() => import('pages/apps/digitalocean-create')),
    exact: true,
  },
  {
    path: '/apps/google-analytics',
    Component: lazy(() => import('pages/apps/google-analytics')),
    exact: true,
  },
  {
    path: '/apps/wordpress-post',
    Component: lazy(() => import('pages/apps/wordpress-post')),
    exact: true,
  },
  {
    path: '/apps/wordpress-posts',
    Component: lazy(() => import('pages/apps/wordpress-posts')),
    exact: true,
  },
  {
    path: '/apps/wordpress-add',
    Component: lazy(() => import('pages/apps/wordpress-add')),
    exact: true,
  },
  {
    path: '/apps/todoist-list',
    Component: lazy(() => import('pages/apps/todoist-list')),
    exact: true,
  },
  {
    path: '/apps/jira-dashboard',
    Component: lazy(() => import('pages/apps/jira-dashboard')),
    exact: true,
  },
  {
    path: '/apps/jira-agile-board',
    Component: lazy(() => import('pages/apps/jira-agile-board')),
    exact: true,
  },
  {
    path: '/apps/helpdesk-dashboard',
    Component: lazy(() => import('pages/apps/helpdesk-dashboard')),
    exact: true,
  },
  // Widgets
  {
    path: '/widgets/general',
    Component: lazy(() => import('pages/widgets/general')),
    exact: true,
  },
  {
    path: '/widgets/lists',
    Component: lazy(() => import('pages/widgets/lists')),
    exact: true,
  },
  {
    path: '/widgets/tables',
    Component: lazy(() => import('pages/widgets/tables')),
    exact: true,
  },
  {
    path: '/widgets/charts',
    Component: lazy(() => import('pages/widgets/charts')),
    exact: true,
  },
  // Cards
  {
    path: '/cards/basic-cards',
    Component: lazy(() => import('pages/cards/basic-cards')),
    exact: true,
  },
  {
    path: '/cards/tabbed-cards',
    Component: lazy(() => import('pages/cards/tabbed-cards')),
    exact: true,
  },
  // UI Kits
  {
    path: '/ui-kits/bootstrap',
    Component: lazy(() => import('pages/ui-kits/bootstrap')),
    exact: true,
  },
  {
    path: '/ui-kits/antd',
    Component: lazy(() => import('pages/ui-kits/antd')),
    exact: true,
  },
  // Tables
  {
    path: '/tables/bootstrap',
    Component: lazy(() => import('pages/tables/bootstrap')),
    exact: true,
  },
  {
    path: '/tables/antd',
    Component: lazy(() => import('pages/tables/antd')),
    exact: true,
  },
  // Charts
  {
    path: '/charts/chartistjs',
    Component: lazy(() => import('pages/charts/chartistjs')),
    exact: true,
  },
  {
    path: '/charts/chartjs',
    Component: lazy(() => import('pages/charts/chartjs')),
    exact: true,
  },
  {
    path: '/charts/c3',
    Component: lazy(() => import('pages/charts/c3')),
    exact: true,
  },
  // Icons
  {
    path: '/icons/feather-icons',
    Component: lazy(() => import('pages/icons/feather-icons')),
    exact: true,
  },
  {
    path: '/icons/fontawesome',
    Component: lazy(() => import('pages/icons/fontawesome')),
    exact: true,
  },
  {
    path: '/icons/linearicons-free',
    Component: lazy(() => import('pages/icons/linearicons-free')),
    exact: true,
  },
  {
    path: '/icons/icomoon-free',
    Component: lazy(() => import('pages/icons/icomoon-free')),
    exact: true,
  },
  // Advanced
  {
    path: '/advanced/form-examples',
    Component: lazy(() => import('pages/advanced/form-examples')),
    exact: true,
  },
  {
    path: '/advanced/email-templates',
    Component: lazy(() => import('pages/advanced/email-templates')),
    exact: true,
  },
  {
    path: '/advanced/utilities',
    Component: lazy(() => import('pages/advanced/utilities')),
    exact: true,
  },
  {
    path: '/advanced/grid',
    Component: lazy(() => import('pages/advanced/grid')),
    exact: true,
  },
  {
    path: '/advanced/typography',
    Component: lazy(() => import('pages/advanced/typography')),
    exact: true,
  },
  {
    path: '/advanced/pricing-tables',
    Component: lazy(() => import('pages/advanced/pricing-tables')),
    exact: true,
  },
  {
    path: '/advanced/invoice',
    Component: lazy(() => import('pages/advanced/invoice')),
    exact: true,
  },
  {
    path: '/advanced/colors',
    Component: lazy(() => import('pages/advanced/colors')),
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

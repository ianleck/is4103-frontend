import React, { useState, useEffect } from 'react'
import { Link, withRouter } from 'react-router-dom'
import { connect } from 'react-redux'
import { reduce } from 'lodash'
import styles from './style.module.scss'

const mapStateToProps = ({ menu, user }) => ({
  menuData: menu.menuData,
  role: user.role,
})

const Breadcrumbs = props => {
  const [breadcrumbs, setBreadcrumbs] = useState([])
  const {
    location: { pathname },
    menuData = [],
    role,
  } = props
  useEffect(() => {
    setBreadcrumbs(() => getBreadcrumbs())
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname, menuData])

  const getPath = (data, url, parents = []) => {
    const items = reduce(
      data,
      (result, entry) => {
        if (result.length) {
          return result
        }
        if (entry.url === url) {
          return [entry].concat(parents)
        }
        if (entry.children) {
          const nested = getPath(entry.children, url, [entry].concat(parents))
          return (result || []).concat(nested.filter(e => !!e))
        }
        return result
      },
      [],
    )
    return items.length > 0 ? items : [false]
  }

  const getBreadcrumbs = () => {
    const [activeMenuItem, ...path] = getPath(menuData, pathname)

    if (!activeMenuItem) {
      return null
    }
    if (activeMenuItem && path.length) {
      return path.reverse().map((item, index) => {
        if (index === path.length - 1) {
          return (
            <span key={item.key}>
              <span className={styles.arrow} />
              <span>{item.title}</span>
              <span className={styles.arrow} />
              <strong className={styles.current}>{activeMenuItem.title}</strong>
            </span>
          )
        }
        return (
          <span key={item.key}>
            <span className={styles.arrow} />
            <span>{item.title}</span>
          </span>
        )
      })
    }
    return (
      <span>
        <span className={styles.arrow} />
        <strong className={styles.current}>{activeMenuItem.title}</strong>
      </span>
    )
  }

  const checkHomePath = () => {
    switch (role) {
      case 'sensei':
        return '/sensei'
      case 'student':
        return '/student'
      case 'admin':
        return '/admin'
      default:
        return '/'
    }
  }

  return (
    breadcrumbs &&
    (breadcrumbs.length ? (
      <div className={styles.breadcrumbs}>
        <div className={styles.path}>
          <Link to={checkHomePath}>Home</Link>
          {breadcrumbs}
        </div>
      </div>
    ) : null)
  )
}

export default withRouter(connect(mapStateToProps)(Breadcrumbs))

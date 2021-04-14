import React, { useState, useEffect } from 'react'
import { connect } from 'react-redux'
import { Menu } from 'antd'
import { Link, useHistory, withRouter } from 'react-router-dom'
import classNames from 'classnames'
import store from 'store'
import { find } from 'lodash'
import UserActionGroup from 'components/UserActionGroup'
import { DIGI_DOJO } from 'constants/text'
import Search from 'components/Common/Search'
import style from './style.module.scss'

const mapStateToProps = ({ menu, settings, user }) => ({
  menuData: menu.menuData,
  logo: settings.logo,
  menuColor: settings.menuColor,
  role: user.role,
  authorized: user.authorized,
})

const MenuTop = ({ menuData = [], location: { pathname }, menuColor, logo, role, authorized }) => {
  const [selectedKeys, setSelectedKeys] = useState(store.get('app.menu.selectedKeys') || [])
  const history = useHistory()

  useEffect(() => {
    applySelectedKeys()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname, menuData])

  const applySelectedKeys = () => {
    const flattenItems = (items, key) =>
      items.reduce((flattenedItems, item) => {
        flattenedItems.push(item)
        if (Array.isArray(item[key])) {
          return flattenedItems.concat(flattenItems(item[key], key))
        }
        return flattenedItems
      }, [])
    const selectedItem = find(flattenItems(menuData, 'children'), ['url', pathname])
    setSelectedKeys(selectedItem ? [selectedItem.key] : [])
  }

  const handleClick = e => {
    store.set('app.menu.selectedKeys', [e.key])
    setSelectedKeys([e.key])
  }

  const generateMenuItems = () => {
    const generateItem = item => {
      const { key, title, url, icon, disabled, count } = item
      if (item.category) {
        return null
      }
      if (item.url) {
        return (
          <Menu.Item key={key} disabled={disabled}>
            {item.target && (
              <a href={url} target={item.target} rel="noopener noreferrer">
                {icon && <span className={`${icon} ${style.icon}`} />}
                <span className={style.title}>{title}</span>
                {count && <span className="badge badge-success ml-2">{count}</span>}
              </a>
            )}
            {!item.target && (
              <Link to={url}>
                {icon && <span className={`${icon} ${style.icon}`} />}
                <span className={style.title}>{title}</span>
                {count && <span className="badge badge-success ml-2">{count}</span>}
              </Link>
            )}
          </Menu.Item>
        )
      }
      return (
        <Menu.Item key={key} disabled={disabled}>
          {icon && <span className={`${icon} ${style.icon}`} />}
          <span className={style.title}>{title}</span>
          {count && <span className="badge badge-success ml-2">{count}</span>}
        </Menu.Item>
      )
    }
    const generateSubmenu = items =>
      items.map(menuItem => {
        if (menuItem.children) {
          const subMenuTitle = (
            <span key={menuItem.key}>
              {menuItem.icon && <span className={`${menuItem.icon} ${style.icon}`} />}
              <span className={style.title}>{menuItem.title}</span>
              {menuItem.count && <span className="badge badge-success ml-2">{menuItem.count}</span>}
            </span>
          )
          return (
            <Menu.SubMenu title={subMenuTitle} key={menuItem.key}>
              {generateSubmenu(menuItem.children)}
            </Menu.SubMenu>
          )
        }
        return generateItem(menuItem)
      })
    return menuData.map(menuItem => {
      if (menuItem.roles && !menuItem.roles.includes(role)) {
        return null
      }
      if (menuItem.children) {
        const subMenuTitle = (
          <span key={menuItem.key}>
            {menuItem.icon && <span className={`${menuItem.icon} ${style.icon}`} />}
            <span className={style.title}>{menuItem.title}</span>
            {menuItem.count && <span className="badge badge-success ml-2">{menuItem.count}</span>}
          </span>
        )
        return (
          <Menu.SubMenu title={subMenuTitle} key={menuItem.key}>
            {generateSubmenu(menuItem.children)}
          </Menu.SubMenu>
        )
      }
      return generateItem(menuItem)
    })
  }

  return (
    <div
      className={classNames(`${style.menu}`, {
        [style.white]: menuColor === 'white',
        [style.gray]: menuColor === 'gray',
        [style.dark]: menuColor === 'dark',
      })}
    >
      <div className={style.logoContainer}>
        <div
          role="button"
          tabIndex={0}
          className={`${style.logo} defocus-btn clickable`}
          onClick={() => history.replace('/')}
          onKeyDown={e => e.preventDefault()}
        >
          <img src="/resources/images/logo.svg" width="32" className="mr-2" alt={DIGI_DOJO} />
          <div className={style.name}>{logo}</div>
        </div>
      </div>
      <div className={style.navigation}>
        <Menu onClick={handleClick} selectedKeys={selectedKeys} mode="horizontal">
          {generateMenuItems()}
        </Menu>
      </div>
      <div className={`${style.action} row justify-content-end text-right`}>
        {authorized && (
          <div className="col pr-0 text-center text-md-right">
            <Search />
          </div>
        )}
        <div className="col pr-4">
          <UserActionGroup />
        </div>
      </div>
    </div>
  )
}

export default withRouter(connect(mapStateToProps)(MenuTop))

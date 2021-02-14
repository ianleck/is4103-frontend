import React, { useState, useEffect } from 'react'
import { connect } from 'react-redux'
import { Menu } from 'antd'
import { Link, withRouter } from 'react-router-dom'
import store from 'store'
import { find } from 'lodash'
import style from './style.module.scss'

const mapStateToProps = ({ settings, user }) => ({
  menuData: [
    {
      title: 'Development',
      key: 'development',
      children: [
        {
          title: 'Web Development',
          key: 'webDevelopment',
          url: '/courses/development/web-development',
        },
        {
          title: 'Data Science',
          key: 'dataScience',
          url: '/courses/development/data-science',
        },
        {
          title: 'Mobile Development',
          key: 'mobileDevelopment',
          url: '/courses/development/mobile-development',
        },
        {
          title: 'Programming Languages',
          key: 'programmingLanguages',
          url: '/courses/development/programming-languages',
        },
      ],
    },
    {
      title: 'Business',
      key: 'business',
      children: [
        {
          title: 'Entrepreneurship',
          key: 'entrepreneurship',
          url: '/courses/business/entrepreneurship',
        },
        {
          title: 'Communications',
          key: 'communications',
          url: '/courses/business/communications',
        },
        {
          title: 'Management',
          key: 'management',
          url: '/courses/business/management',
        },
        {
          title: 'Sales',
          key: 'sales',
          url: '/courses/business/sales',
        },
      ],
    },
    {
      title: 'Finance & Accounting',
      key: 'financeAndAccounting',
      children: [
        {
          title: 'Accounting & Bookkeeping',
          key: 'accountingAndBookkeeping',
          url: '/courses/finance-and-accounting/accounting-and-bookkeeping',
        },
        {
          title: 'Compliance',
          key: 'compliance',
          url: '/courses/finance-and-accounting/compliance',
        },
        {
          title: 'Cryptocurrency & Blockchain',
          key: 'cryptocurrencyAndBlockchain',
          url: '/courses/finance-and-accounting/cryptocurrency-and-blockchain',
        },
        {
          title: 'Economics',
          key: 'economics',
          url: '/courses/finance-and-accounting/economics',
        },
      ],
    },
    {
      title: 'IT & Software',
      key: 'itAndSoftware',
      children: [
        {
          title: 'IT Certification',
          key: 'ITCertification',
          url: '/courses/it-and-software/it-certification',
        },
        {
          title: 'Network & Security',
          key: 'networkAndSecurity',
          url: '/courses/it-and-software/network-and-security',
        },
        {
          title: 'Hardware',
          key: 'hardware',
          url: '/courses/it-and-software/hardware',
        },
        {
          title: 'Operating Systems',
          key: 'operatingSystems',
          url: '/courses/it-and-software/operating-systems',
        },
      ],
    },
  ],
  logo: settings.logo,
  menuColor: settings.menuColor,
  role: user.role,
})

const CourseCategoryBar = ({ menuData = [], location: { pathname }, role }) => {
  const [selectedKeys, setSelectedKeys] = useState(store.get('app.menu.selectedKeys') || [])

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
    <div className={style.navigation}>
      <Menu onClick={handleClick} selectedKeys={selectedKeys} mode="horizontal">
        {generateMenuItems()}
      </Menu>
    </div>
  )
}

export default withRouter(connect(mapStateToProps)(CourseCategoryBar))

import React from 'react'
import { useSelector } from 'react-redux'
import { useHistory } from 'react-router-dom'
import { Avatar } from 'antd'
import { getImage, getUserFullName, sendToSocialProfile } from 'components/utils'
import style from './style.module.scss'

const PageHeader = ({
  type,
  listing,
  course,
  customTitle,
  customSubtitle,
  customImg,
  customClassName,
  bgColor,
  noShadow,
  children,
}) => {
  const user = useSelector(state => state.user)
  const history = useHistory()

  return (
    <div className={type !== 'custom' ? 'col-12 pl-0 pr-0 mt-4' : customClassName}>
      <div className={`${noShadow ? 'card shadow-none' : 'card'} ${bgColor}`}>
        <div className="card-body">
          <div className="row align-items-center">
            <div className="col-auto col-lg-auto">
              {type === 'mentorship' && <Avatar src={getImage('user', listing.Sensei)} size={48} />}
              {type === 'course' && (
                <div
                  className={style.resultThumb}
                  style={{
                    backgroundImage: `url(${getImage('course', course)})`,
                  }}
                />
              )}
              {type === 'custom' && customImg}
            </div>
            <div className="col-10 col-lg-5 col-xl-6">
              <span className="h5">
                {type === 'mentorship' && listing.name}
                {type === 'course' && course.title}
                {type === 'custom' && customTitle}
              </span>
              <br />
              {type !== 'custom' && (
                <small
                  role="button"
                  tabIndex={0}
                  className="text-muted defocus-btn clickable"
                  onClick={() =>
                    sendToSocialProfile(
                      user,
                      history,
                      type === 'mentorship' ? listing.accountId : course.accountId,
                    )
                  }
                  onKeyDown={e => e.preventDefault()}
                >
                  {`by ${getUserFullName(type === 'mentorship' ? listing.Sensei : course.Sensei)}`}
                </small>
              )}
              {type === 'custom' && <small>{customSubtitle}</small>}
            </div>
            {children}
          </div>
        </div>
      </div>
    </div>
  )
}

export default PageHeader

import React from 'react'
import { useHistory } from 'react-router-dom'
import { Avatar } from 'antd'
import { isNil } from 'lodash'
import { getUserFullName, sendToSocialProfile } from 'components/utils'
import style from './style.module.scss'

const PageHeader = ({ type, listing, course, children }) => {
  const history = useHistory()

  const getBackgroundImage = object => {
    if (type === 'user')
      return object?.profileImgUrl ? object.profileImgUrl : '/resources/images/avatars/avatar-2.png'
    if (type === 'mentorship')
      return object.Sensei?.profileImgUrl
        ? object.Sensei?.profileImgUrl
        : '/resources/images/avatars/avatar-2.png'
    if (type === 'course')
      return !isNil(object.imgUrl) ? object.imgUrl : '/resources/images/course-placeholder.png'
    return null
  }

  return (
    <div className="col-12 pl-0 pr-0 mt-4">
      <div className="card">
        <div className="card-body">
          <div className="row align-items-center">
            <div className="col-auto col-lg-auto">
              {type === 'mentorship' && (
                <Avatar
                  src={
                    listing.Sensei?.profileImgUrl
                      ? listing.Sensei?.profileImgUrl
                      : '/resources/images/avatars/avatar-2.png'
                  }
                  size={48}
                />
              )}
              {type === 'course' && (
                <div
                  className={style.resultThumb}
                  style={{
                    backgroundImage: `url(${getBackgroundImage('course', course)})`,
                  }}
                />
              )}
            </div>
            <div className="col-10 col-lg-5 col-xl-6">
              <span className="h5">{type === 'mentorship' ? listing.name : course.title}</span>
              <br />
              <small
                role="button"
                tabIndex={0}
                className="text-muted defocus-btn clickable"
                onClick={() =>
                  sendToSocialProfile(
                    history,
                    type === 'mentorship' ? listing.accountId : course.accountId,
                  )
                }
                onKeyDown={e => e.preventDefault()}
              >
                {`by ${getUserFullName(type === 'mentorship' ? listing.Sensei : course.Sensei)}`}
              </small>
            </div>
            {children}
          </div>
        </div>
      </div>
    </div>
  )
}

export default PageHeader

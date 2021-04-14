import React from 'react'
import { useHistory } from 'react-router-dom'
import { Avatar } from 'antd'
import { getImage, getUserFullName, sendToSocialProfile } from 'components/utils'
import style from './style.module.scss'

const PageHeader = ({ type, listing, course, children }) => {
  const history = useHistory()

  return (
    <div className="col-12 pl-0 pr-0 mt-4">
      <div className="card">
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

import React from 'react'
import { useHistory } from 'react-router-dom'
import { Avatar, Button, Divider, Rate, Skeleton } from 'antd'
import { EyeOutlined, UserOutlined } from '@ant-design/icons'
import { isNil } from 'lodash'
import { getUserFullName } from 'components/utils'
import { USER_TYPE_ENUM } from 'constants/constants'
import { useSelector } from 'react-redux'

const CourseListingCard = ({ course, isLoading, className, isUpsellItem }) => {
  const history = useHistory()
  const user = useSelector(state => state.user)
  const viewOnly =
    user.userType === USER_TYPE_ENUM.ADMIN ||
    user.userType === USER_TYPE_ENUM.SENSEI ||
    isUpsellItem

  return (
    <div className={isNil(className) ? 'col-12 col-md-4 col-xl-3' : className}>
      <Skeleton active loading={isLoading}>
        <div
          role="button"
          tabIndex={0}
          className={`card text-left w-100 ${
            viewOnly ? 'defocus-btn font-small' : 'btn p-0 rounded-lg'
          }`}
          onClick={() => !viewOnly && history.push(`/courses/${course.courseId}`)}
          onKeyDown={event => event.preventDefault()}
        >
          <div className="card-header pl-2 pt-1 pb-1 text-secondary">
            <span>
              <i className="fe fe-book" />
              &nbsp;&nbsp;COURSE
            </span>
          </div>
          <div className="course-card-img-holder overflow-hidden">
            <img
              className="course-card-img"
              alt="example"
              src={
                !isNil(course.imgUrl) ? course.imgUrl : '/resources/images/course-placeholder.png'
              }
            />
          </div>
          <div className="card-body p-3">
            <div className="card-text w-100">
              <div className="row">
                <div className="col-12">
                  <span className="card-title w-100 mb-0 h5 text-dark font-weight-bold text-2-lines truncate-2-overflow">
                    {course.title}
                  </span>
                </div>
              </div>
              <div className="row mt-2">
                <div className="col-12">
                  <span className="font-weight-bold">${course.priceAmount.toFixed(2)}</span>
                </div>
              </div>
              {!isUpsellItem && (
                <div className="row">
                  <div className="col-12">
                    <span>
                      <Rate disabled defaultValue={course.rating} />
                    </span>
                  </div>
                </div>
              )}
            </div>
            {!isUpsellItem && <Divider className="mt-2 mb-3" />}
            {!isUpsellItem && (
              <div className="row align-items-center justify-content-between">
                <div className="col-auto">
                  <Avatar
                    size={32}
                    icon={<UserOutlined />}
                    src={
                      course.Sensei?.profileImgUrl
                        ? course.Sensei.profileImgUrl
                        : '/resources/images/avatars/avatar-2.png'
                    }
                  />
                </div>
                <div className="col pl-0">
                  <span className="p-0 text-dark text-wrap truncate-1-overflow">
                    {getUserFullName(course.Sensei)}
                  </span>
                </div>
              </div>
            )}
            {isUpsellItem && (
              <div className="mt-2">
                <Button
                  block
                  type="default"
                  size="large"
                  icon={<EyeOutlined />}
                  onClick={() => history.push(`/courses/${course.courseId}`)}
                >
                  View
                </Button>
              </div>
            )}
          </div>
        </div>
      </Skeleton>
    </div>
  )
}

export default CourseListingCard

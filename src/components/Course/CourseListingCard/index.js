import React from 'react'
import { useHistory } from 'react-router-dom'
import { Avatar, Divider, Rate, Skeleton } from 'antd'
import { UserOutlined } from '@ant-design/icons'
import { isNil, random } from 'lodash'

const CourseListingCard = data => {
  const history = useHistory()
  const { course, isLoading } = data

  return (
    <div className="col-12 col-md-4 col-xl-3">
      <Skeleton active loading={isLoading}>
        <div
          role="button"
          tabIndex={0}
          className="card btn text-left w-100"
          onClick={() => history.push(`/courses/${course.courseId}`)}
          onKeyDown={event => event.preventDefault()}
        >
          <div className="card-header p-0 text-secondary">
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
              <div className="row">
                <div className="col-12">
                  <span>
                    <Rate disabled defaultValue={course.rating} />
                    <small>&nbsp;&nbsp;{random(1, 15000)}</small>
                  </span>
                </div>
              </div>
              <div className="row">
                <div className="col-12">
                  <span className="w-100 mt-2 text-dark text-2-lines truncate-2-overflow text-break">
                    {course.description}
                  </span>
                </div>
              </div>
            </div>
            <Divider className="mt-4 mb-3" />
            <div className="row align-items-center justify-content-between">
              <div className="col-auto">
                <Avatar
                  size={32}
                  icon={<UserOutlined />}
                  src={
                    course.Sensei?.profileImgUrl
                      ? course.Sensei.profileImgUrl
                      : '/resources/images/avatars/master.png'
                  }
                />
              </div>
              <div className="col pl-0">
                <span className="p-0 text-dark text-wrap truncate-1-overflow">
                  {`${isNil(course.Sensei?.firstName) ? 'Anonymous' : course.Sensei?.firstName} ${
                    isNil(course.Sensei?.lastName) ? 'Pigeon' : course.Sensei?.lastName
                  }`}
                </span>
              </div>
            </div>
          </div>
        </div>
      </Skeleton>
    </div>
  )
}

export default CourseListingCard

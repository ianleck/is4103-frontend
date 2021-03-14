import React from 'react'
import { useHistory } from 'react-router-dom'
import { Skeleton, Tag } from 'antd'
import { formatTime } from 'components/utils'
import { isNil } from 'lodash'
import { ADMIN_VERIFIED_ENUM } from 'constants/constants'

const SenseiCourseCard = data => {
  const history = useHistory()
  const { course, isLoading } = data

  const StatusTag = () => {
    let colour
    switch (course.adminVerified) {
      case ADMIN_VERIFIED_ENUM.ACCEPTED:
        colour = 'processing'
        break
      case ADMIN_VERIFIED_ENUM.PENDING:
        colour = 'warning'
        break
      case ADMIN_VERIFIED_ENUM.REJECTED:
        colour = 'error'
        break
      case ADMIN_VERIFIED_ENUM.DRAFT:
        colour = 'default'
        break
      default:
        break
    }
    return <Tag color={colour}>{course.adminVerified}</Tag>
  }

  return (
    <Skeleton active loading={isLoading}>
      <div
        role="button"
        tabIndex={0}
        className="card btn p-0 text-left text-dark"
        onClick={() => history.push(`/sensei/courses/create/${course.courseId}`)}
        onKeyDown={event => event.preventDefault()}
      >
        <div className="row no-gutters align-items-center">
          <div className="col-3 overflow-hidden">
            <img
              className="sensei-course-card"
              alt="example"
              src={
                !isNil(course.imgUrl) ? course.imgUrl : '/resources/images/course-placeholder.png'
              }
            />
          </div>
          <div className="col-9">
            <div className="card-body">
              <div className="d-flex align-items-start flex-column sensei-course-card-content">
                <div className="h5 card-title font-weight-bold truncate-2-overflow">
                  {course.title}
                </div>
                <p className="card-text truncate-2-overflow">{course.description}</p>
                <div className="row w-100 align-items-center mt-auto">
                  <div className="col-12">
                    <StatusTag />
                  </div>
                  <div className="col-12 mt-1">
                    <small className="text-uppercase text-secondary">
                      Created on {formatTime(course.createdAt)}
                    </small>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Skeleton>
  )
}

export default SenseiCourseCard

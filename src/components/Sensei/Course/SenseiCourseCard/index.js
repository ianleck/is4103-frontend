import React from 'react'
import { useHistory } from 'react-router-dom'
import { Skeleton } from 'antd'
import { formatTime } from 'components/utils'
import { isNil } from 'lodash'
import StatusTag from 'components/Common/StatusTag'

const SenseiCourseCard = data => {
  const history = useHistory()
  const { course, isLoading } = data

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
                <div className="h5 card-title font-weight-bold truncate-2-overflow text-break">
                  {course.title}
                </div>
                <p className="card-text text-break truncate-2-overflow">{course.description}</p>
                <div className="row w-100 align-items-center mt-auto">
                  <div className="col-12">
                    <StatusTag data={course} type="ADMIN_VERIFIED_ENUM" />
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

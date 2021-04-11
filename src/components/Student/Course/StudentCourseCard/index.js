import React from 'react'
import { Progress, Skeleton } from 'antd'
import { useHistory } from 'react-router-dom'
import { isNil, size } from 'lodash'
import { formatTime } from 'components/utils'

const StudentCourseCard = data => {
  const history = useHistory()
  const { course, isLoading } = data

  const getPurchaseDate = () => {
    if (course.CourseContracts) {
      if (size(course.CourseContracts) > 0) {
        return course.CourseContracts[0].createdAt
      }
    }
    return course.createdAt
  }

  const getPercentageCompletion = () => {
    const numLessons = 2 // Placeholder for when numLessons will be returned to the contract
    if (course.CourseContracts) {
      if (size(course.CourseContracts) > 0) {
        return ((size(course.CourseContracts[0].lessonProgress) / numLessons) * 100).toFixed(0)
      }
    }
    return 50
  }

  return (
    <Skeleton active loading={isLoading}>
      <div
        role="button"
        tabIndex={0}
        className="card btn p-0 text-left text-dark"
        onClick={() => history.push(`/student/dashboard/courses/${course.courseId}`)}
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
                <p className="card-text text-break truncate-2-overflow">{course.description}</p>
                <div className="row w-100 align-items-center mt-auto">
                  <div className="col-12 mt-1">
                    <Progress percent={getPercentageCompletion()} status="active" />
                  </div>
                  <div className="col-12 mt-1">
                    <small className="text-uppercase text-secondary">
                      Purchased on {formatTime(getPurchaseDate())}
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

export default StudentCourseCard

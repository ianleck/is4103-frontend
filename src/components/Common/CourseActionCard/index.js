import { Image } from 'antd'
import { isNil } from 'lodash'
import React from 'react'

const CourseActions = ({ course, children }) => {
  return (
    <div className="card">
      <div className="course-card-img-max overflow-hidden">
        <Image
          className="course-card-img"
          src={!isNil(course.imgUrl) ? course.imgUrl : '/resources/images/course-placeholder.png'}
        />
      </div>
      <div className="card-body">{children}</div>
    </div>
  )
}

export default CourseActions

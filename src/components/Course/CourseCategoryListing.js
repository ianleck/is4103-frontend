import { UserOutlined } from '@ant-design/icons'
import { Avatar } from 'antd'
import { map } from 'lodash'
import React from 'react'

const CourseCategoryListing = data => {
  const { categoryName, courses } = data.coursesInCategory

  return (
    <div>
      <div className="row align-items-center mb-2">{`Popular Courses for ${categoryName}`}</div>
      <div className="row">{map(courses, course => showCourseCard(course))}</div>
    </div>
  )
}

const showCourseCard = course => {
  return (
    <div className="col-12 col-xs-12 col-sm-6 col-md-4 col-lg-3">
      <div className="card w-100" key={course.key}>
        <div className="card-body">
          <div className="row align-items-center justify-content-between">
            <div className="col-4">
              <Avatar size={64} icon={<UserOutlined />} />
            </div>
            <div className="col">
              <h5 className="card-title text-wrap">{course.courseName}</h5>
              <h6 className="card-subtitle mb-2 text-muted text-wrap">{course.instructorName}</h6>
            </div>
          </div>
          <br />
          <div className="card-text">
            <p>Information Line 1</p>
            <p>Information Line 2</p>
          </div>
        </div>
      </div>
    </div>
  )
}
export default CourseCategoryListing

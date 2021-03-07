import { UserOutlined } from '@ant-design/icons'
import { Avatar, Divider, Rate } from 'antd'
import { map, random, round } from 'lodash'
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
    <div className="col-12 col-md-6 col-xl-4">
      <div className="card btn text-left w-100" key={course.key}>
        <div className="card-body">
          <div className="card-text w-100">
            <div className="row">
              <div className="col-12">
                <span className="card-title d-inline-block w-100 mb-0 h5 text-dark  font-weight-bold text-truncate">
                  {course.courseName}
                </span>
              </div>
            </div>
            <div className="row">
              <div className="col-12">
                <span className="font-weight-bold">${round(random(19.99, 39.99), 2)}</span>
              </div>
            </div>
            <div className="row">
              <div className="col-12">
                <span>
                  <Rate disabled defaultValue={random(0, 5)} />
                  <small>&nbsp;&nbsp;{random(1, 15000)}</small>
                </span>
              </div>
            </div>
            <div className="row">
              <div className="col-12">
                <span className="w-100 mt-2 text-dark d-inline-block text-truncate">
                  {course.description}
                </span>
              </div>
            </div>
          </div>
          <Divider className="mt-1 mb-3" />
          <div className="row align-items-center justify-content-between">
            <div className="col-auto">
              <Avatar size={32} icon={<UserOutlined />} />
            </div>
            <div className="col pl-0">
              <span className="mb-2 text-dark text-wrap">{course.instructorName}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
export default CourseCategoryListing

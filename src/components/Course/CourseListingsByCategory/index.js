import React from 'react'
import { map, size } from 'lodash'
import CourseListingCard from 'components/Course/CourseListingCard'
import { Empty } from 'antd'

const CourseListingsByCategory = data => {
  const { courses, isLoading } = data
  const courseData = map(courses, res => ({ ...res, key: res.courseId }))

  const showCourseCard = course => {
    return <CourseListingCard key={course.key} course={course} isLoading={isLoading} />
  }

  return (
    <div>
      <div className="row">
        {size(courseData) > 0 && map(courseData, course => showCourseCard(course))}
        {size(courseData) === 0 && (
          <div className="col-12">
            <Empty />
          </div>
        )}
      </div>
    </div>
  )
}

export default CourseListingsByCategory

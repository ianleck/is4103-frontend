import React from 'react'
import { map } from 'lodash'
import CourseListingCard from 'components/Course/CourseListingCard'

const CourseListingsByCategory = data => {
  const { courses, isLoading } = data
  const courseData = map(courses, res => ({ ...res, key: res.courseId }))

  const showCourseCard = course => {
    return <CourseListingCard key={course.key} course={course} isLoading={isLoading} />
  }

  return (
    <div>
      <div className="row">{map(courseData, course => showCourseCard(course))}</div>
    </div>
  )
}

export default CourseListingsByCategory

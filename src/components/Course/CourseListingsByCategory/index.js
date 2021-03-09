import React from 'react'
import { map } from 'lodash'
import CourseListingCard from 'components/Course/CourseListingCard'

const CourseListingsByCategory = data => {
  const { categoryName, courses } = data.courses
  return (
    <div>
      <div className="row align-items-center mb-2">{`Popular Courses for ${categoryName}`}</div>
      <div className="row">{map(courses, course => showCourseCard(course))}</div>
    </div>
  )
}

const showCourseCard = course => {
  return <CourseListingCard key={course.key} course={course} />
}
export default CourseListingsByCategory

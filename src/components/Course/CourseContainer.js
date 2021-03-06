import React from 'react'
import CourseCategoryListing from './CourseCategoryListing'
import FeaturedCourses from './FeaturedCourses'

const CourseContainer = () => {
  const courseData = {
    categoryName: 'Finance & Accounting',
    courses: [
      {
        key: 1,
        courseName: 'F & A (1)',
        instructorName: 'Ann Summers',
      },
      {
        key: 2,
        courseName: 'F & A (2)',
        instructorName: 'Bob Autumn',
      },
      {
        key: 3,
        courseName: 'F & A (3)',
        instructorName: 'Charlie Winters',
      },
      {
        key: 4,
        courseName: 'F & A (4)',
        instructorName: 'Dean Spring',
      },
    ],
  }
  return (
    <div className="container">
      <FeaturedCourses />
      <CourseCategoryListing coursesInCategory={courseData} />
    </div>
  )
}

export default CourseContainer

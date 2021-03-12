import { Helmet } from 'react-helmet'
import React, { useEffect } from 'react'
import { getCourses } from 'services/courses'
import CourseListingsByCategory from 'components/Course/CourseListingsByCategory'
import FeaturedCourses from 'components/Course/FeaturedCourses'

const BrowseCoursesPage = () => {
  useEffect(() => {
    const getCoursesEffect = async () => {
      const result = await getCourses()
      console.log(result)
    }
    getCoursesEffect()
  }, [])

  const courseData = {
    categoryName: 'Finance & Accounting',
    courses: [
      {
        key: 1,
        courseName: 'F & A (3) F & A (3) F & A (3) F & A (3) F & A (3) F & A (3)',
        instructorName: 'Ann Summers',
        description:
          'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore',
      },
      {
        key: 2,
        courseName: 'F & A (2)',
        instructorName: 'Bob Autumn',
        description:
          'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.',
      },
      {
        key: 3,
        courseName: 'F & A (3) F & A (3) F & A (3) F & A (3) F & A (3) F & A (3)',
        instructorName: 'Charlie Winters',
        description: 'Lorem ipsum dolor sit amet.',
      },
      {
        key: 4,
        courseName: 'F & A (4)',
        instructorName: 'Dean Spring',
        description:
          'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam.',
      },
    ],
  }

  return (
    <div>
      <Helmet title="Courses" />
      <FeaturedCourses />
      <CourseListingsByCategory courses={courseData} />
    </div>
  )
}

export default BrowseCoursesPage

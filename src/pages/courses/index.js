import { Helmet } from 'react-helmet'
import React from 'react'
import CourseContainer from 'components/Course/CourseContainer'

const CourseListPage = () => {
  return (
    <div>
      <Helmet title="Courses" />
      <CourseContainer />
    </div>
  )
}

export default CourseListPage

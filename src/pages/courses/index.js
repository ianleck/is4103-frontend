import React, { useEffect, useState } from 'react'
import { isNil } from 'lodash'
import { Helmet } from 'react-helmet'
import { getCourses } from 'services/courses'
import CourseListingsByCategory from 'components/Course/CourseListingsByCategory'
// import FeaturedCourses from 'components/Course/FeaturedCourses'
import { DEFAULT_TIMEOUT } from 'constants/constants'

const BrowseCoursesPage = () => {
  const [courses, setCourses] = useState([])
  const [isLoading, setIsLoading] = useState(false)

  const setLoadingIndicator = loading => {
    if (loading) setIsLoading(true)
    else {
      setTimeout(() => {
        setIsLoading(false)
      }, DEFAULT_TIMEOUT)
    }
  }

  useEffect(() => {
    const getCoursesEffect = async () => {
      setLoadingIndicator(true)
      const result = await getCourses()
      if (result && !isNil(result.courses)) {
        setCourses(result.courses)
      }
      setLoadingIndicator(false)
    }
    getCoursesEffect()
  }, [])

  return (
    <div>
      <Helmet title="Courses" />
      {/* <FeaturedCourses /> */}
      <CourseListingsByCategory courses={courses} isLoading={isLoading} />
    </div>
  )
}

export default BrowseCoursesPage

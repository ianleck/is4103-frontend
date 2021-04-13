import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { isNil, size } from 'lodash'
import { Helmet } from 'react-helmet'
import { getCourses } from 'services/courses'
import BackBtn from 'components/Common/BackBtn'
import CourseListingsByCategory from 'components/Course/CourseListingsByCategory'
import { DEFAULT_TIMEOUT } from 'constants/constants'

const BrowseCoursesPage = () => {
  const [courses, setCourses] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const { categoryId } = useParams()

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
        if (!isNil(categoryId)) {
          setCourses(
            result.courses.filter(
              course => size(course.Categories.filter(cat => cat.categoryId === categoryId)) > 0,
            ),
          )
        } else {
          setCourses(result.courses)
        }
      }
      setLoadingIndicator(false)
    }
    getCoursesEffect()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div>
      <Helmet title="Courses" />
      {!isNil(categoryId) && (
        <div className="row pt-2">
          <div className="col-12 col-md-3 col-lg-2 mt-4 mt-md-0">
            <BackBtn url="/courses" />
          </div>
        </div>
      )}
      {isNil(categoryId) && (
        <div className="mb-5">
          <img src="/resources/images/pages/browse/courses.png" width="100%" alt="courses banner" />
        </div>
      )}
      <CourseListingsByCategory courses={courses} isLoading={isLoading} />
    </div>
  )
}

export default BrowseCoursesPage

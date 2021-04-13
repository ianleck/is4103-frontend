import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { filter, isNil, size } from 'lodash'
import { Helmet } from 'react-helmet'
import { getCourses } from 'services/courses'
import BackBtn from 'components/Common/BackBtn'
import CourseListingsByCategory from 'components/Course/CourseListingsByCategory'
import { DEFAULT_TIMEOUT } from 'constants/constants'
import { useSelector } from 'react-redux'

const BrowseCoursesPage = () => {
  const [courses, setCourses] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const { categoryId } = useParams()
  const categories = useSelector(state => state.categories)

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
            filter(
              result.courses,
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
        <div className="row align-items-center pt-2 mb-5">
          <div className="col-6 col-sm-4 col-md-3 col-lg-2 mt-4 mt-md-0">
            <BackBtn url="/courses" />
          </div>
          <div className="col mt-4 mt-md-0">
            <h3 className="m-0">{categories[categoryId].name}</h3>
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

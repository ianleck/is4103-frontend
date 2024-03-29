import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { filter, isNil, map, size } from 'lodash'
import { Helmet } from 'react-helmet'
import { getCourses } from 'services/courses'
import BackBtn from 'components/Common/BackBtn'
import { DEFAULT_TIMEOUT } from 'constants/constants'
import { useSelector } from 'react-redux'
import PaginationWrapper from 'components/Common/Pagination'
import CourseListingCard from 'components/Course/CourseListingCard'
import { initPageItems } from 'components/utils'
import { Empty } from 'antd'

const BrowseCoursesPage = () => {
  const [courses, setCourses] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [paginatedCourses, setPaginatedCourses] = useState([])
  const [currentPageIdx, setCurrentPageIdx] = useState(1)
  const [showLoadMore, setShowLoadMore] = useState(false)

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

  const getCoursesSvc = async () => {
    setLoadingIndicator(true)
    const result = await getCourses()
    if (result && !isNil(result.courses)) {
      if (!isNil(categoryId)) {
        const filteredResults = filter(
          result.courses,
          course => size(filter(course.Categories, cat => cat.categoryId === categoryId)) > 0,
        )
        setCourses(filteredResults)
        initPageItems(
          setIsLoading,
          filteredResults,
          setPaginatedCourses,
          setCurrentPageIdx,
          setShowLoadMore,
        )
      } else {
        setCourses(result.courses)
        initPageItems(
          setIsLoading,
          result.courses,
          setPaginatedCourses,
          setCurrentPageIdx,
          setShowLoadMore,
        )
      }
    }
    setLoadingIndicator(false)
  }

  useEffect(() => {
    getCoursesSvc()
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
      <PaginationWrapper
        setIsLoading={setIsLoading}
        totalData={courses}
        paginatedData={paginatedCourses}
        setPaginatedData={setPaginatedCourses}
        currentPageIdx={currentPageIdx}
        setCurrentPageIdx={setCurrentPageIdx}
        showLoadMore={showLoadMore}
        setShowLoadMore={setShowLoadMore}
        buttonStyle="link"
        className="row"
        wrapperContent={
          size(paginatedCourses) > 0 &&
          map(paginatedCourses, course => {
            return <CourseListingCard key={course.courseId} course={course} isLoading={isLoading} />
          })
        }
      />
      <div className="row">
        <div className="col-12">{size(courses) === 0 && <Empty />}</div>
      </div>
    </div>
  )
}

export default BrowseCoursesPage

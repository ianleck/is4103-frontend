import React, { useEffect, useState } from 'react'
import { Empty } from 'antd'
import { isNil, size } from 'lodash'
import { useSelector } from 'react-redux'
import { getPurchasedCourses } from 'services/courses'
import { DEFAULT_TIMEOUT } from 'constants/constants'
import StudentCourseCard from 'components/Student/Course/StudentCourseCard'
import { PURCHASED_COURSES } from 'constants/text'

const StudentPurchasedCourses = () => {
  const user = useSelector(state => state.user)

  const [courses, setCourses] = useState([])
  const [isLoading, setIsLoading] = useState(false)

  const getAllPurchasedCourses = async () => {
    setIsLoading(true)
    const result = await getPurchasedCourses(user.accountId)
    if (result && !isNil(result.requests)) {
      setCourses(result.requests)
    }
    setTimeout(() => {
      setIsLoading(false)
    }, DEFAULT_TIMEOUT)
  }

  useEffect(() => {
    getAllPurchasedCourses()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const PurchasedCourses = () => {
    const DisplayStudentCourseCards = () => {
      if (size(courses) > 0)
        return courses.map(course => {
          return (
            <div key={course.courseId} className="col-12 col-lg-6 col-xl-4">
              <StudentCourseCard course={course} isLoading={isLoading} />
            </div>
          )
        })
      return (
        <div className="col-12 mt-4">
          <Empty />
        </div>
      )
    }

    return (
      <div className="row mt-4">
        <DisplayStudentCourseCards />
      </div>
    )
  }

  return (
    <div>
      <div className="row mt-4">
        <div className="col-auto">
          <div className="text-dark h3">
            <strong>{PURCHASED_COURSES}</strong>
          </div>
        </div>
      </div>
      <PurchasedCourses />
    </div>
  )
}

export default StudentPurchasedCourses

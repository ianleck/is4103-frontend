import React, { useEffect, useState } from 'react'
import { Helmet } from 'react-helmet'
import { useHistory } from 'react-router-dom'
import { Button, Input, Select, Skeleton } from 'antd'
import { PlusOutlined } from '@ant-design/icons'
import { getSenseiCourses } from 'services/courses'
import { ADMIN_VERIFIED_ENUM, VISIBILITY_ENUM } from 'constants/constants'
import { useSelector } from 'react-redux'
import { isNil, size } from 'lodash'
import { formatTime } from 'components/utils'

const SenseiCourses = () => {
  const history = useHistory()
  const user = useSelector(state => state.user)

  const [courseDrafts, setCourseDrafts] = useState('')
  const [isDraftsLoading, setIsDraftsLoading] = useState(false)

  const { Option } = Select
  const { Search } = Input

  useEffect(() => {
    const getCourseDrafts = async () => {
      setIsDraftsLoading(true)
      const result = await getSenseiCourses(
        user.accountId,
        ADMIN_VERIFIED_ENUM.DRAFT,
        VISIBILITY_ENUM.HIDDEN,
      )
      console.log('getCourseDrafts', result)
      if (result && !isNil(result.courses)) {
        setCourseDrafts(result.courses)
      }
      setTimeout(() => {
        setIsDraftsLoading(false)
      }, 550)
    }
    getCourseDrafts()
  }, [user.accountId])

  const SenseiCourseCard = data => {
    const { course } = data
    return (
      <Skeleton active loading={isDraftsLoading}>
        <div
          role="button"
          tabIndex={0}
          className="card btn p-0 text-left text-dark"
          onClick={() => history.push(`/sensei/courses/create/${course.courseId}`)}
          onKeyDown={event => event.preventDefault()}
        >
          <div className="row no-gutters align-items-center sensei-course-card">
            <div className="col-3" style={{ overflow: 'scroll' }}>
              <img
                className="sensei-course-card"
                alt="example"
                src="https://gw.alipayobjects.com/zos/rmsportal/JiqGstEfoWAOHiTxclqi.png"
              />
            </div>
            <div className="col-9">
              <div className="card-body">
                <div className="d-flex align-items-start flex-column sensei-course-card-content">
                  <div className="h5 card-title truncate-2-overflow">{course.title}</div>
                  <p className="card-text truncate-2-overflow">{course.description}</p>
                  <div className="row w-100 align-items-center mt-auto">
                    <div className="col-12">
                      <span className="text-uppercase">{course.adminVerified}</span>
                    </div>
                    <div className="col-12">
                      <small className="text-uppercase text-secondary">
                        Created on {formatTime(course.createdAt)}
                      </small>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Skeleton>
    )
  }

  return (
    <div className="container">
      <Helmet title="My Courses" />
      <div className="row align-items-center">
        <div className="col-12 col-md-4">
          <Search placeholder="Search Courses" size="large" allowClear />
        </div>
        <div className="col-12 col-md-5 mt-4 mt-md-0">
          <Select className="w-50" size="large" placeholder="Sort by">
            <Option value="desc">Newest First</Option>
            <Option value="asc">Oldest First</Option>
          </Select>
        </div>
        <div className="col-12 col-md-3 mt-4 mt-md-0 text-center text-md-right">
          <Button
            type="primary"
            size="large"
            shape="round"
            icon={<PlusOutlined />}
            onClick={() => history.push('/sensei/courses/create')}
          >
            Add New Course
          </Button>
        </div>
      </div>
      <div className="row mt-5">
        <div className="col-auto">
          <div className="text-dark h3">
            <strong>Drafts</strong>
          </div>
        </div>
      </div>
      <div className="row mt-2">
        {size(courseDrafts) > 0 &&
          courseDrafts.map(course => {
            return (
              <div key={course.courseId} className="col-12 col-lg-6">
                <SenseiCourseCard course={course} />
              </div>
            )
          })}
      </div>
    </div>
  )
}

export default SenseiCourses

import React, { useEffect, useState } from 'react'
import { Helmet } from 'react-helmet'
import { useHistory } from 'react-router-dom'
import { Button, Empty, Input, Radio, Select } from 'antd'
import { PlusOutlined } from '@ant-design/icons'
import { getSenseiCourses } from 'services/courses'
import { ADMIN_VERIFIED_ENUM, DEFAULT_TIMEOUT, VISIBILITY_ENUM } from 'constants/constants'
import { useSelector } from 'react-redux'
import { isNil, size } from 'lodash'
import SenseiCourseCard from 'components/Sensei/Course/SenseiCourseCard'

const SenseiCourses = () => {
  const history = useHistory()
  const user = useSelector(state => state.user)

  const [courses, setCourses] = useState('')
  const [pageTitle, setPageTitle] = useState('drafts')
  const [isLoading, setIsLoading] = useState(false)

  const { Option } = Select
  const { Search } = Input

  const getCourses = async tabKey => {
    setLoadingIndicator(true)
    switch (tabKey) {
      case 'drafts':
        {
          setPageTitle('Drafts')
          const draftCourses = await getSenseiCourses(
            user.accountId,
            ADMIN_VERIFIED_ENUM.DRAFT,
            null,
          )
          const pendingCourses = await getSenseiCourses(
            user.accountId,
            ADMIN_VERIFIED_ENUM.PENDING,
            null,
          )
          if (
            draftCourses &&
            pendingCourses &&
            !isNil(draftCourses.courses) &&
            !isNil(pendingCourses.courses)
          ) {
            setCourses([...draftCourses.courses, ...pendingCourses.courses])
          }
        }
        break
      case 'published':
        {
          setPageTitle('Published Courses')
          const publishedCourses = await getSenseiCourses(
            user.accountId,
            null,
            VISIBILITY_ENUM.PUBLISHED,
          )
          if (publishedCourses && !isNil(publishedCourses.courses)) {
            setCourses(...publishedCourses.courses)
          }
        }
        break
      case 'hidden':
        {
          setPageTitle('Hidden Courses')
          const hiddenCourses = await getSenseiCourses(
            user.accountId,
            ADMIN_VERIFIED_ENUM.ACCEPTED,
            VISIBILITY_ENUM.HIDDEN,
          )
          if (hiddenCourses && !isNil(hiddenCourses.courses)) {
            setCourses(...hiddenCourses.courses)
          }
        }
        break
      case 'rejected':
        {
          setPageTitle('Rejected Courses')
          const rejectedCourses = await getSenseiCourses(
            user.accountId,
            ADMIN_VERIFIED_ENUM.ACCEPTED,
            VISIBILITY_ENUM.HIDDEN,
          )
          if (rejectedCourses && !isNil(rejectedCourses.courses)) {
            setCourses(...rejectedCourses.courses)
          }
        }
        break
      default:
        break
    }
    setLoadingIndicator(false)
  }

  const DisplaySenseiCourseCards = () => {
    if (size(courses) > 0)
      return courses.map(course => {
        return (
          <div key={course.courseId} className="col-12 col-lg-6">
            <SenseiCourseCard course={course} isLoading={isLoading} />
          </div>
        )
      })
    return (
      <div className="col-12 mt-4">
        <Empty />
      </div>
    )
  }

  const setLoadingIndicator = loading => {
    if (loading) setIsLoading(true)
    else {
      setTimeout(() => {
        setIsLoading(false)
      }, DEFAULT_TIMEOUT)
    }
  }

  useEffect(() => {
    getCourses('drafts')
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div className="container">
      <Helmet title="My Courses" />
      <div className="row align-items-center">
        <div className="col-12 mt-2 text-center text-md-right">
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
      <div className="row mt-4">
        <div className="col-auto">
          <div className="text-dark h3">
            <strong>{pageTitle}</strong>
          </div>
        </div>
      </div>
      <div className="row mt-2 align-items-center">
        <div className="col-12 col-lg-auto mt-2 mt-lg-0 text-center text-lg-left">
          <Radio.Group defaultValue="drafts" size="large">
            <Radio.Button value="drafts" onClick={() => getCourses('drafts')}>
              Drafts
            </Radio.Button>
            <Radio.Button value="published" onClick={() => getCourses('published')}>
              Published
            </Radio.Button>
            <Radio.Button value="hidden" onClick={() => getCourses('hidden')}>
              Hidden
            </Radio.Button>
            <Radio.Button value="rejected" onClick={() => getCourses('rejected')}>
              Rejected
            </Radio.Button>
          </Radio.Group>
        </div>
        <div className="col-12 col-lg-4 mt-4 mt-lg-0">
          <Search placeholder="Search Courses" size="large" allowClear />
        </div>
        <div className="col-6 col-lg-3 mt-4 mt-lg-0">
          <Select className="w-100" size="large" placeholder="Sort by">
            <Option value="desc">Newest First</Option>
            <Option value="asc">Oldest First</Option>
          </Select>
        </div>
      </div>
      <div className="row mt-4">
        <DisplaySenseiCourseCards />
      </div>
    </div>
  )
}

export default SenseiCourses

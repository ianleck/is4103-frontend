import React, { useEffect, useState } from 'react'
import { Helmet } from 'react-helmet'
import { useHistory } from 'react-router-dom'
import { Button, Empty, Input, Radio, Select } from 'antd'
import { PlusOutlined } from '@ant-design/icons'
import { getSenseiCourses } from 'services/courses'
import { ADMIN_VERIFIED_ENUM, DEFAULT_TIMEOUT, VISIBILITY_ENUM } from 'constants/constants'
import { useSelector } from 'react-redux'
import { isEmpty, isNil, size } from 'lodash'
import SenseiCourseCard from 'components/Sensei/Course/SenseiCourseCard'
import CountIconWidgetGroup from 'components/Common/CountIconWidgetGroup'
import { COURSES } from 'constants/text'

const SenseiCourses = () => {
  const history = useHistory()
  const user = useSelector(state => state.user)

  const [courses, setCourses] = useState([])
  const [coursesTemp, setCoursesTemp] = useState([])
  const [pageTitle, setPageTitle] = useState('Published Courses')
  const [currentSortOrder, setCurrentSortOrder] = useState('desc')
  const [isLoading, setIsLoading] = useState(false)

  const [numPendingCourses, setNumPendingCourses] = useState(0)
  const [numAcceptedCourses, setNumAcceptedCourses] = useState(0)
  const [numRejectedCourses, setNumRejectedCourses] = useState(0)

  const { Option } = Select
  const { Search } = Input

  const sortCoursesByDate = (coursesToSort, sort) => {
    if (coursesToSort) {
      if (sort === 'asc')
        return coursesToSort.sort(
          (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
        )
      return coursesToSort.sort(
        (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
      )
    }
    return coursesToSort
  }

  const reorderCourses = sort => {
    setCurrentSortOrder(sort)
    setCourses(sortCoursesByDate(courses, sort))
  }

  const searchCourses = keyword => {
    if (isEmpty(keyword)) {
      setCourses(sortCoursesByDate(coursesTemp, currentSortOrder))
    } else {
      const courseData = coursesTemp.filter(o =>
        o.title.toLowerCase().includes(keyword.toLowerCase()),
      )
      setCourses(sortCoursesByDate(courseData, currentSortOrder))
    }
  }

  const getCourseStats = async () => {
    const draftCoursesRsp = await getSenseiCourses(user.accountId, ADMIN_VERIFIED_ENUM.DRAFT, null)
    const pendingCoursesRsp = await getSenseiCourses(
      user.accountId,
      ADMIN_VERIFIED_ENUM.PENDING,
      null,
    )
    const acceptedCoursesRsp = await getSenseiCourses(
      user.accountId,
      ADMIN_VERIFIED_ENUM.ACCEPTED,
      null,
    )
    const rejectedCoursesRsp = await getSenseiCourses(
      user.accountId,
      ADMIN_VERIFIED_ENUM.REJECTED,
      null,
    )

    setNumPendingCourses(
      pendingCoursesRsp &&
        !isNil(pendingCoursesRsp.courses) &&
        draftCoursesRsp &&
        !isNil(draftCoursesRsp.courses)
        ? size(pendingCoursesRsp.courses) + size(draftCoursesRsp.courses)
        : 0,
    )

    setNumAcceptedCourses(
      acceptedCoursesRsp && !isNil(acceptedCoursesRsp.courses)
        ? size(acceptedCoursesRsp.courses)
        : 0,
    )
    setNumRejectedCourses(
      rejectedCoursesRsp && !isNil(rejectedCoursesRsp.courses)
        ? size(rejectedCoursesRsp.courses)
        : 0,
    )
  }

  const getCourses = async tabKey => {
    setLoadingIndicator(true)
    getCourseStats()
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
            const courseData = sortCoursesByDate(
              [...draftCourses.courses, ...pendingCourses.courses],
              currentSortOrder,
            )
            setCourses(courseData)
            setCoursesTemp(courseData)
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
            const courseData = sortCoursesByDate([...publishedCourses.courses], currentSortOrder)
            setCourses(courseData)
            setCoursesTemp(courseData)
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
            const courseData = sortCoursesByDate([...hiddenCourses.courses], currentSortOrder)
            setCourses(courseData)
            setCoursesTemp(courseData)
          }
        }
        break
      case 'rejected':
        {
          setPageTitle('Rejected Courses')
          const rejectedCourses = await getSenseiCourses(
            user.accountId,
            ADMIN_VERIFIED_ENUM.REJECTED,
            null,
          )
          if (rejectedCourses && !isNil(rejectedCourses.courses)) {
            const courseData = sortCoursesByDate([...rejectedCourses.courses], currentSortOrder)
            setCourses(courseData)
            setCoursesTemp(courseData)
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
          <div key={course.courseId} className="col-12 col-lg-6 col-xl-4">
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
    getCourses('published')
    getCourseStats()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div className="container">
      <Helmet title="My Courses" />
      <CountIconWidgetGroup
        objectType={COURSES}
        numAccepted={numAcceptedCourses}
        numPending={numPendingCourses}
        numRejected={numRejectedCourses}
        noClick
        pendingPrefix="Draft"
        acceptedPrefix="Accepted"
        rejectedPrefix="Rejected"
      />
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
        <div className="col-12 col-lg-5 mt-2 mt-lg-0 text-center text-lg-left">
          <Radio.Group defaultValue="published" size="large">
            <Radio.Button value="published" onClick={() => getCourses('published')}>
              Published
            </Radio.Button>
            <Radio.Button value="hidden" onClick={() => getCourses('hidden')}>
              Hidden
            </Radio.Button>
            <Radio.Button value="drafts" onClick={() => getCourses('drafts')}>
              Drafts
            </Radio.Button>
            <Radio.Button value="rejected" onClick={() => getCourses('rejected')}>
              Rejected
            </Radio.Button>
          </Radio.Group>
        </div>
        <div className="col-12 col-lg-4 mt-4 mt-lg-0">
          <Search
            placeholder="Search Courses"
            size="large"
            allowClear
            onSearch={data => searchCourses(data)}
          />
        </div>
        <div className="col-8 col-lg-3 mt-4 mt-lg-0">
          <Select
            className="w-100"
            size="large"
            placeholder="Sort by"
            onChange={sort => reorderCourses(sort)}
            defaultValue="desc"
          >
            <Option value="desc">Most Recent First</Option>
            <Option value="asc">Least Recent First</Option>
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

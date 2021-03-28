import React, { useEffect, useState } from 'react'
import { useHistory } from 'react-router-dom'
import { isNil, map, size } from 'lodash'
import { COURSES, COURSE_CONTENT_MGT } from 'constants/text'
import { ADMIN_VERIFIED_ENUM } from 'constants/constants'
import { CheckOutlined, CloseOutlined, InfoCircleOutlined } from '@ant-design/icons'
import { Button, Space } from 'antd'
import { formatTime, showNotification } from 'components/utils'
import StatusTag from 'components/Common/StatusTag'
import {
  getCourseRequests,
  acceptCourseRequest,
  rejectCourseRequest,
} from 'services/courses/requests'
import {
  COURSE_ACCEPT_ERROR,
  COURSE_ACCEPT_SUCCESS,
  COURSE_REJECT_ERROR,
  COURSE_REJECT_SUCCESS,
  ERROR,
  SUCCESS,
} from 'constants/notifications'
import { ADMIN_VERIFIED_ENUM_FILTER, VISIBILITY_ENUM_FILTER } from 'constants/filters'
import ManagementSkeleton from 'components/Admin/ManagementSkeleton'

const CourseContentManagement = () => {
  const history = useHistory()

  const [allRequests, setAllRequests] = useState([])
  const [pendingRequests, setPendingRequests] = useState([])
  const [acceptedRequests, setAcceptedRequests] = useState([])
  const [rejectedRequests, setRejectedRequests] = useState([])

  const [currentFilter, setCurrentFilter] = useState('all')

  const [currentTableData, setCurrentTableData] = useState([])

  const approveCourse = async courseId => {
    const result = await acceptCourseRequest(courseId)
    if (result && result.success) {
      retrieveCourseRequests()
      showNotification('success', SUCCESS, COURSE_ACCEPT_SUCCESS)
    } else {
      showNotification('error', ERROR, COURSE_ACCEPT_ERROR)
    }
  }

  const rejectCourse = async courseId => {
    const result = await rejectCourseRequest(courseId)
    if (result && result.success) {
      retrieveCourseRequests()
      showNotification('success', SUCCESS, COURSE_REJECT_SUCCESS)
    } else {
      showNotification('error', ERROR, COURSE_REJECT_ERROR)
    }
  }

  const retrieveCourseRequests = async () => {
    const filterCourses = requests => {
      setPendingRequests(filterRequests(requests, ADMIN_VERIFIED_ENUM.PENDING))
      setAcceptedRequests(filterRequests(requests, ADMIN_VERIFIED_ENUM.ACCEPTED))
      setRejectedRequests(filterRequests(requests, ADMIN_VERIFIED_ENUM.REJECTED))
    }

    const result = await getCourseRequests()
    if (result && !isNil(result.requests)) {
      setCurrentTableData(sortAndKeyRequests(result.requests))
      setAllRequests(result.requests)
      filterCourses(result.requests)
    }
  }

  const filterRequests = (requests, adminVerified) => {
    const preparedData = sortAndKeyRequests(requests, 'desc')
    if (!isNil(adminVerified)) {
      return preparedData.filter(o => {
        return o.adminVerified === adminVerified
      })
    }
    return requests
  }

  const sortAndKeyRequests = (requests, order) => {
    if (order === 'asc')
      return map(
        requests.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()),
        course => ({
          ...course,
          key: course.courseId,
        }),
      )
    return map(
      requests.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()),
      course => ({
        ...course,
        key: course.courseId,
      }),
    )
  }

  const setTableData = filter => {
    if (currentFilter === filter) {
      setCurrentTableData(sortAndKeyRequests(allRequests))
      setCurrentFilter('all')
      return
    }
    switch (filter) {
      case 'pending':
        setCurrentTableData(filterRequests(allRequests, ADMIN_VERIFIED_ENUM.PENDING))
        break
      case 'accepted':
        setCurrentTableData(filterRequests(allRequests, ADMIN_VERIFIED_ENUM.ACCEPTED))
        break
      case 'rejected':
        setCurrentTableData(filterRequests(allRequests, ADMIN_VERIFIED_ENUM.REJECTED))
        break
      default:
        setCurrentTableData(allRequests)
        break
    }
    setCurrentFilter(filter)
  }

  const tableColumns = [
    {
      title: 'Created At',
      key: 'createdAt',
      dataIndex: 'createdAt',
      width: '15%',
      responsive: ['lg'],
      render: record => formatTime(record),
      sorter: (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
      sortDirections: ['ascend', 'descend'],
    },
    {
      title: 'Title',
      dataIndex: 'title',
      key: 'title',
      sorter: (a, b) => a.title.length - b.title.length,
      sortDirections: ['ascend', 'descend'],
    },
    {
      title: 'Verification Status',
      dataIndex: 'adminVerified',
      key: 'adminVerified',
      filters: ADMIN_VERIFIED_ENUM_FILTER,
      onFilter: (value, record) => record.adminVerified.indexOf(value) === 0,
      render: record => <StatusTag data={{ adminVerified: record }} />,
    },
    {
      title: 'Visibility',
      dataIndex: 'visibility',
      key: 'visibility',
      responsive: ['md'],
      filters: VISIBILITY_ENUM_FILTER,
      onFilter: (value, record) => record.visibility.indexOf(value) === 0,
    },
    {
      title: 'Action',
      key: 'action',
      render: record => (
        <Space size="large">
          <Button
            type="primary"
            shape="circle"
            size="large"
            icon={<InfoCircleOutlined />}
            onClick={() => history.push(`/admin/course-content-management/${record.courseId}`)}
          />
          <Button
            className="btn btn-success"
            size="large"
            shape="circle"
            icon={<CheckOutlined />}
            disabled={record.adminVerified === ADMIN_VERIFIED_ENUM.ACCEPTED}
            onClick={() => approveCourse(record.courseId)}
          />
          <Button
            type="danger"
            size="large"
            shape="circle"
            icon={<CloseOutlined />}
            disabled={record.adminVerified === ADMIN_VERIFIED_ENUM.REJECTED}
            onClick={() => rejectCourse(record.courseId)}
          />
        </Space>
      ),
    },
  ]

  const handleAcceptedWidgetOnClick = () => {
    setTableData('accepted')
  }
  const handlePendingWidgetOnClick = () => {
    setTableData('pending')
  }
  const handleRejectedWidgetOnClick = () => {
    setTableData('rejected')
  }

  useEffect(() => {
    retrieveCourseRequests()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <ManagementSkeleton
      currentFilter={currentFilter}
      currentTableData={currentTableData}
      handleAcceptedWidgetOnClick={handleAcceptedWidgetOnClick}
      handlePendingWidgetOnClick={handlePendingWidgetOnClick}
      handleRejectedWidgetOnClick={handleRejectedWidgetOnClick}
      numAcceptedRequests={size(acceptedRequests)}
      numPendingRequests={size(pendingRequests)}
      numRejectedRequests={size(rejectedRequests)}
      objectType={COURSES}
      pageTitle={COURSE_CONTENT_MGT}
      tableColumns={tableColumns}
    />
  )
}

export default CourseContentManagement

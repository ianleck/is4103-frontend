import React, { useEffect, useState } from 'react'
import { useHistory } from 'react-router-dom'
import { Helmet } from 'react-helmet'
import { isNil, map, size } from 'lodash'
import {
  ACCEPTED_COURSES,
  COURSE_CONTENT_MGT,
  PENDING_COURSES,
  REJECTED_COURSES,
} from 'constants/text'
import { ADMIN_VERIFIED_ENUM, VISIBILITY_ENUM } from 'constants/constants'
import CountIconWidget from 'components/Common/CountIconWidget'
import {
  CheckOutlined,
  CloseOutlined,
  ExceptionOutlined,
  InfoCircleOutlined,
} from '@ant-design/icons'
import { Button, Space, Table, Tabs } from 'antd'
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

const CourseContentManagement = () => {
  const { TabPane } = Tabs
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
      filters: [
        {
          text: ADMIN_VERIFIED_ENUM.PENDING,
          value: ADMIN_VERIFIED_ENUM.PENDING,
        },
        { text: ADMIN_VERIFIED_ENUM.ACCEPTED, value: ADMIN_VERIFIED_ENUM.ACCEPTED },
        { text: ADMIN_VERIFIED_ENUM.REJECTED, value: ADMIN_VERIFIED_ENUM.REJECTED },
      ],
      onFilter: (value, record) => record.adminVerified.indexOf(value) === 0,
      render: record => <StatusTag data={{ adminVerified: record }} />,
    },
    {
      title: 'Visibility',
      dataIndex: 'visibility',
      key: 'visibility',
      responsive: ['md'],
      filters: [
        {
          text: VISIBILITY_ENUM.PUBLISHED,
          value: VISIBILITY_ENUM.PUBLISHED,
        },
        { text: VISIBILITY_ENUM.HIDDEN, value: VISIBILITY_ENUM.HIDDEN },
      ],
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

  useEffect(() => {
    retrieveCourseRequests()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div>
      <div className="row">
        <Helmet title={COURSE_CONTENT_MGT} />
        <div className="col-auto">
          <div className="text-dark text-uppercase h3">
            <strong>{COURSE_CONTENT_MGT}</strong>
          </div>
        </div>
      </div>

      <div className="row mt-4">
        <div className="col-12 col-md-4">
          <CountIconWidget
            title={PENDING_COURSES}
            className={`${currentFilter === 'pending' ? 'btn btn-light' : 'btn'}`}
            count={size(pendingRequests)}
            icon={<ExceptionOutlined />}
            onClick={() => setTableData('pending')}
            color="orange"
          />
        </div>

        <div className="col-6 col-md-4">
          <CountIconWidget
            title={ACCEPTED_COURSES}
            className={`${currentFilter === 'accepted' ? 'btn btn-light' : 'btn'}`}
            count={size(acceptedRequests)}
            icon={<CheckOutlined />}
            onClick={() => setTableData('accepted')}
            color="green"
          />
        </div>

        <div className="col-6 col-md-4">
          <CountIconWidget
            title={REJECTED_COURSES}
            className={`${currentFilter === 'rejected' ? 'btn btn-light' : 'btn'}`}
            count={size(rejectedRequests)}
            icon={<CloseOutlined />}
            onClick={() => setTableData('rejected')}
            color="red"
          />
        </div>

        <div className="col-12">
          <div className="card">
            <div className="card-header card-header-flex">
              <div className="d-flex flex-column justify-content-center mr-auto">
                <h5>List of Courses</h5>
              </div>
              <Tabs activeKey="courses" className="kit-tabs">
                <TabPane tab="Courses" key="courses" />
              </Tabs>
            </div>
            <div className="card-body overflow-x-scroll mr-3 mr-sm-0">
              <Table className="w-100" dataSource={currentTableData} columns={tableColumns} />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CourseContentManagement

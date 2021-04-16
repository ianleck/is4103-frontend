import { AppstoreAddOutlined, AppstoreOutlined, CopyOutlined } from '@ant-design/icons'
import { DatePicker } from 'antd'
import Charting from 'components/Admin/AdminDashboard/Charting'
import ActiveAdminWidget from 'components/Admin/AdminManagement/ActiveAdminWidget'
import SenseiWidget from 'components/Admin/UsersManagement/SenseiWidget'
import StudentWidget from 'components/Admin/UsersManagement/StudentWidget'
import CountIconWidget from 'components/Common/CountIconWidget'
import PageHeader from 'components/Common/PageHeader'
import { filterDataByAdminVerified } from 'components/utils'
import { ADMIN_VERIFIED_ENUM } from 'constants/constants'
import { filter, isEmpty, isNil, map, size } from 'lodash'
import React, { useEffect, useState } from 'react'
import { HorizontalBar } from 'react-chartjs-2'
import { Helmet } from 'react-helmet'
import { getAllMentorshipContracts, getAllMentorshipListings } from 'services/admin'
import {
  getCourseCategorySales,
  getCourseSales,
  getMentorshipCategorySales,
  getMentorshipSales,
} from 'services/analytics'
import { getCourseRequests } from 'services/courses/requests'

const AdminDashboard = () => {
  const { RangePicker } = DatePicker

  const today = new Date()
  const dftDateStart = new Date(today.getFullYear(), today.getMonth(), 1)
  const dftDateEnd = new Date(today.getFullYear(), today.getMonth() + 1, 0)

  /* MentorPass Sales Data */
  const [mtsGraphDt, setMtsGraphDt] = useState([])
  const [mtsCategoryGraphDt, setMtsCategoryGraphDt] = useState([])

  /* Course Sales Data */
  const [courseGraphDt, setCourseGraphDt] = useState([])
  const [courseCategoryGraphDt, setCourseCategoryGraphDt] = useState([])

  /* Mentorship Data */
  const [numListings, setNumListings] = useState(0)
  const [numPendingApplications, setNumPendingApplications] = useState(0)
  const [numApprovedApplications, setNumApprovedApplications] = useState(0)
  const [numRejectedApplications, setNumRejectedApplications] = useState(0)
  const [numTotalApplications, setNumTotalApplications] = useState(0)

  /* Course Data */
  const [numTotalCourses, setNumTotalCourses] = useState(0)
  const [numPendingCourses, setNumPendingCourses] = useState(0)
  const [numAcceptedCourses, setNumAcceptedCourses] = useState(0)
  const [numRejectedCourses, setNumRejectedCourses] = useState(0)

  const getChartOptions = type => {
    let title
    if (type === 'mentorship') title = 'Mentorship Listing Sales Per Time Period'
    if (type === 'course') title = 'Course Sales Per Time Period'
    if (type === 'mtsCategory') title = 'Mentorship Sales By Category Per Time Period'
    if (type === 'courseCategory') title = 'Course Sales By Category Per Time Period'
    const chartOptions = {
      title: {
        display: true,
        position: 'bottom',
        text: title,
      },
      layout: {
        padding: {
          right: 50,
        },
      },
      scales: {
        xAxes: [
          {
            ticks: {
              beginAtZero: true,
              suggestedMin: 0,
              stepSize: 1,
            },
          },
        ],
      },
      maintainAspectRatio: false,
      legend: {
        display: false,
      },
      // events: ['mousemove', 'click'],
      // onHover: (event, chartElement) => {
      //   event.target.style.cursor = chartElement[0] ? 'pointer' : 'default'
      // },
    }
    return chartOptions
  }

  const getCourseStats = async () => {
    const result = await getCourseRequests()

    const allCourses = result.requests
    const pendingCourses = filterDataByAdminVerified(result.requests, ADMIN_VERIFIED_ENUM.PENDING)
    const acceptedCourses = filterDataByAdminVerified(result.requests, ADMIN_VERIFIED_ENUM.ACCEPTED)
    const rejectedCourses = filterDataByAdminVerified(result.requests, ADMIN_VERIFIED_ENUM.REJECTED)

    setNumTotalCourses(size(allCourses))
    setNumPendingCourses(size(pendingCourses))
    setNumAcceptedCourses(size(acceptedCourses))
    setNumRejectedCourses(size(rejectedCourses))
  }

  const getApplicationStats = async () => {
    const response = await getAllMentorshipContracts()

    const data = map(response, (c, i) => ({ ...c, key: i }))
    setNumPendingApplications(size(filter(data, ['senseiApproval', 'PENDING'])))
    setNumApprovedApplications(size(filter(data, ['senseiApproval', 'APPROVED'])))
    setNumRejectedApplications(size(filter(data, ['senseiApproval', 'REJECTED'])))
    setNumTotalApplications(size(data))
  }

  const getMentorshipSalesData = async (queryDateStart, queryDateEnd) => {
    const mentorshipSalesData = await getMentorshipSales(queryDateStart, queryDateEnd)
    if (mentorshipSalesData && !isNil(mentorshipSalesData.sales)) {
      const listings = mentorshipSalesData.sales
      const mtsGraphVals = []
      const mtsGraphLabels = map(listings, listing => {
        mtsGraphVals.push(listing.mentorPassCount)
        return listing.MentorshipListing?.name
      })
      const graphData = {
        labels: mtsGraphLabels,
        datasets: [
          {
            label: 'MentorPasses Sold',
            backgroundColor: '#428bca',
            borderColor: '#428bca',
            borderWidth: 1,
            hoverBackgroundColor: 'rgba(158, 158, 158, 0.7)',
            hoverBorderColor: 'rgba(158, 158, 158, 0.7)',
            shadowOffsetX: 4,
            shadowOffsetY: 4,
            shadowBlur: 4,
            shadowColor: 'rgba(0, 0, 0, 0.4)',
            data: mtsGraphVals,
          },
        ],
      }
      setMtsGraphDt(graphData)
    }
  }

  const getMentorshipCategorySalesData = async (queryDateStart, queryDateEnd) => {
    const mentorshipCategorySalesData = await getMentorshipCategorySales(
      queryDateStart,
      queryDateEnd,
    )
    if (mentorshipCategorySalesData && !isNil(mentorshipCategorySalesData.sales)) {
      const listings = mentorshipCategorySalesData.sales
      const mtsCategoryGraphVals = []
      const mtsCategoryGraphLabels = map(listings, (key, value) => {
        mtsCategoryGraphVals.push(key)
        return value
      })
      const graphData = {
        labels: mtsCategoryGraphLabels,
        datasets: [
          {
            label: 'Mentorships Sold By Category',
            backgroundColor: '#428bca',
            borderColor: '#428bca',
            borderWidth: 1,
            hoverBackgroundColor: 'rgba(158, 158, 158, 0.7)',
            hoverBorderColor: 'rgba(158, 158, 158, 0.7)',
            shadowOffsetX: 4,
            shadowOffsetY: 4,
            shadowBlur: 4,
            shadowColor: 'rgba(0, 0, 0, 0.4)',
            data: mtsCategoryGraphVals,
          },
        ],
      }
      setMtsCategoryGraphDt(graphData)
    }
  }

  const getCourseSalesData = async (queryDateStart, queryDateEnd) => {
    const courseSalesData = await getCourseSales(queryDateStart, queryDateEnd)
    if (courseSalesData && !isNil(courseSalesData.sales)) {
      const courses = courseSalesData.sales
      const courseGraphVals = []
      const courseGraphLbls = map(courses, course => {
        courseGraphVals.push(course.courseCount)
        return course.Course?.title
      })
      const graphData = {
        labels: courseGraphLbls,
        datasets: [
          {
            label: 'Courses Sold',
            backgroundColor: '#8ab3ff',
            borderColor: '#8ab3ff',
            borderWidth: 1,
            hoverBackgroundColor: 'rgba(158, 158, 158, 0.7)',
            hoverBorderColor: 'rgba(158, 158, 158, 0.7)',
            shadowOffsetX: 4,
            shadowOffsetY: 4,
            shadowBlur: 4,
            shadowColor: 'rgba(0, 0, 0, 0.4)',
            data: courseGraphVals,
          },
        ],
      }
      setCourseGraphDt(graphData)
    }
  }

  const getCourseCategorySalesData = async (queryDateStart, queryDateEnd) => {
    const courseCategorySalesData = await getCourseCategorySales(queryDateStart, queryDateEnd)
    if (courseCategorySalesData && !isNil(courseCategorySalesData.sales)) {
      const courses = courseCategorySalesData.sales
      const courseCategoryGraphVals = []
      const courseCategoryGraphLbls = map(courses, (key, value) => {
        courseCategoryGraphVals.push(key)
        return value
      })
      const graphData = {
        labels: courseCategoryGraphLbls,
        datasets: [
          {
            label: 'Courses Sold',
            backgroundColor: '#8ab3ff',
            borderColor: '#8ab3ff',
            borderWidth: 1,
            hoverBackgroundColor: 'rgba(158, 158, 158, 0.7)',
            hoverBorderColor: 'rgba(158, 158, 158, 0.7)',
            shadowOffsetX: 4,
            shadowOffsetY: 4,
            shadowBlur: 4,
            shadowColor: 'rgba(0, 0, 0, 0.4)',
            data: courseCategoryGraphVals,
          },
        ],
      }
      setCourseCategoryGraphDt(graphData)
    }
  }

  const getDashboardData = async () => {
    try {
      // const consultationData = await getConsultations(dateStart, dateEnd)
      // const testimonialData = await getSenseiTestimonials(user.accountId)
      // const walletData = await viewWallet(user.walletId)

      const listingData = await getAllMentorshipListings()
      setNumListings(size(listingData))
      getCourseStats()
      getApplicationStats()
      getMentorshipSalesData(dftDateStart, dftDateEnd)
      getMentorshipCategorySalesData(dftDateStart, dftDateEnd)
      getCourseSalesData(dftDateStart, dftDateEnd)
      getCourseCategorySalesData(dftDateStart, dftDateEnd)
    } catch (e) {
      console.log(e)
    }
  }

  useEffect(() => {
    getDashboardData()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const CourseAnalytics = () => {
    return (
      <div>
        <div className="row">
          <PageHeader
            type="custom"
            customTitle="Course"
            customSubtitle="Statistics"
            customImg={<i className="fe fe-book" />}
            customClassName="col-12 mt-4"
            bgColor="bg-light"
            noShadow
          />
        </div>
        {!isEmpty(courseGraphDt) && (
          <>
            <div className="row pl-5 pr-5 mr-3 mb-4">
              <div className="col-12 text-center text-lg-right">
                <RangePicker
                  size="large"
                  onChange={values => {
                    getCourseSalesData(
                      values[0].format('YYYY-MM-DD').toString(),
                      values[1].format('YYYY-MM-DD').toString(),
                    )
                    getCourseCategorySalesData(
                      values[0].format('YYYY-MM-DD').toString(),
                      values[1].format('YYYY-MM-DD').toString(),
                    )
                  }}
                />
              </div>
            </div>
            <div className="row pl-5 pr-5 mb-4">
              <HorizontalBar
                data={courseGraphDt}
                width={100}
                height={300}
                options={getChartOptions('course')}
              />
            </div>
            <div className="row pl-5 pr-5 mb-4">
              <HorizontalBar
                data={courseCategoryGraphDt}
                width={100}
                height={300}
                options={getChartOptions('courseCategory')}
              />
            </div>
          </>
        )}
        <div className="row pl-5 pr-5">
          <div className="col-12 col-lg-3">
            <CountIconWidget
              title="Courses"
              count={numTotalCourses}
              icon={<AppstoreAddOutlined />}
              noShadow
            />
          </div>
          <div className="col">
            <div className="row">
              <div className="col-6 col-lg-4">
                <CountIconWidget
                  title="Pending"
                  count={numPendingCourses}
                  icon={<AppstoreAddOutlined />}
                  color="grey"
                  noShadow
                />
              </div>
              <div className="col-6 col-lg-4">
                <CountIconWidget
                  title="Approved"
                  count={numAcceptedCourses}
                  icon={<AppstoreAddOutlined />}
                  color="green"
                  noShadow
                />
              </div>
              <div className="col-6 col-lg-4">
                <CountIconWidget
                  title="Rejected"
                  count={numRejectedCourses}
                  icon={<AppstoreAddOutlined />}
                  color="red"
                  noShadow
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  const MentorshipAnalytics = () => {
    return (
      <div>
        <div className="row">
          <PageHeader
            type="custom"
            customTitle="Mentorship"
            customSubtitle="Statistics"
            customImg={<i className="fa fa-graduation-cap" />}
            customClassName="col-12 mt-4"
            bgColor="bg-light"
            noShadow
          />
        </div>
        {!isEmpty(mtsGraphDt) && (
          <>
            <div className="row pl-5 pr-5 mr-3 mb-4">
              <div className="col-12 text-center text-lg-right">
                <RangePicker
                  size="large"
                  onChange={values => {
                    getMentorshipSalesData(
                      values[0].format('YYYY-MM-DD').toString(),
                      values[1].format('YYYY-MM-DD').toString(),
                    )
                    getMentorshipCategorySalesData(
                      values[0].format('YYYY-MM-DD').toString(),
                      values[1].format('YYYY-MM-DD').toString(),
                    )
                  }}
                />
              </div>
            </div>
            <div className="row pl-5 pr-5 mb-4">
              <HorizontalBar
                data={mtsGraphDt}
                width={100}
                height={300}
                options={getChartOptions('mentorship')}
              />
            </div>
            <div className="row pl-5 pr-5 mb-4">
              <HorizontalBar
                data={mtsCategoryGraphDt}
                width={100}
                height={300}
                options={getChartOptions('mtsCategory')}
              />
            </div>
          </>
        )}

        <div className="row pl-5 pr-5">
          <div className="col-4">
            <CountIconWidget
              title="Listings"
              count={numListings}
              icon={<CopyOutlined />}
              noShadow
            />
          </div>
          <div className="col-4">
            <CountIconWidget
              title="Contracts"
              count={numApprovedApplications}
              icon={<AppstoreOutlined />}
              noShadow
            />
          </div>
        </div>
        <div className="row pl-5 pr-5">
          <div className="col-12 col-lg-3">
            <CountIconWidget
              title="Applications"
              count={numTotalApplications}
              icon={<AppstoreAddOutlined />}
              noShadow
            />
          </div>
          <div className="col">
            <div className="row">
              <div className="col-6 col-lg-4">
                <CountIconWidget
                  title="Pending"
                  count={numPendingApplications}
                  icon={<AppstoreAddOutlined />}
                  color="grey"
                  noShadow
                />
              </div>
              <div className="col-6 col-lg-4">
                <CountIconWidget
                  title="Approved"
                  count={numApprovedApplications}
                  icon={<AppstoreAddOutlined />}
                  color="green"
                  noShadow
                />
              </div>
              <div className="col-6 col-lg-4">
                <CountIconWidget
                  title="Rejected"
                  count={numRejectedApplications}
                  icon={<AppstoreAddOutlined />}
                  color="red"
                  noShadow
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="container">
      <Helmet title="Admin Overview" />
      <div className="cui__utils__heading">
        <strong>Admin Dashboard</strong>
      </div>

      <div className="row mt-4">
        <div className="col-12 col-sm-4">
          <StudentWidget />
        </div>
        <div className="col-12 col-sm-4">
          <SenseiWidget />
        </div>
        <div className="col-12 col-sm-4">
          <ActiveAdminWidget />
        </div>
      </div>

      <div className="row">
        <div className="col-xl-12 col-lg-12">
          <Charting />
        </div>
      </div>
      <MentorshipAnalytics />
      <CourseAnalytics />
    </div>
  )
}

export default AdminDashboard

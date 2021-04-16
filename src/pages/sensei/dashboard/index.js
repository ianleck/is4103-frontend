import {
  AppstoreAddOutlined,
  AppstoreOutlined,
  CopyOutlined,
  TeamOutlined,
} from '@ant-design/icons'
import { DatePicker } from 'antd'
import CountIconWidget from 'components/Common/CountIconWidget'
import PageHeader from 'components/Common/PageHeader'
import { ADMIN_VERIFIED_ENUM } from 'constants/constants'
import { filter, isEmpty, isNil, map, size } from 'lodash'
import React, { useEffect, useState } from 'react'
import { HorizontalBar } from 'react-chartjs-2'
import { Helmet } from 'react-helmet'
import { useSelector } from 'react-redux'
import { getCourseSales, getListingApplications, getMentorshipSales } from 'services/analytics'
import { getSenseiCourses } from 'services/courses'
import { getSenseiMentorshipApplications } from 'services/mentorship/applications'
import { getMentees } from 'services/mentorship/contracts'
import { getSenseiMentorshipListings } from 'services/mentorship/listings'

const SenseiDashboard = () => {
  const { RangePicker } = DatePicker

  const today = new Date()
  const dftDateStart = new Date(today.getFullYear(), today.getMonth(), 1)
  const dftDateEnd = new Date(today.getFullYear(), today.getMonth() + 1, 0)

  /* MentorPass Sales Data */
  const [mtsGraphDt, setMtsGraphDt] = useState([])

  /* Course Sales Data */
  const [courseGraphDt, setCourseGraphDt] = useState([])

  /* Mentorship Data */
  const [numListings, setNumListings] = useState(0)
  const [numMentees, setNumMentees] = useState(0)
  const [numPendingApplications, setNumPendingApplications] = useState(0)
  const [numApprovedApplications, setNumApprovedApplications] = useState(0)
  const [numRejectedApplications, setNumRejectedApplications] = useState(0)
  const [numTotalApplications, setNumTotalApplications] = useState(0)
  const [contractsByApplications, setNumContractsByApplications] = useState([])

  /* Course Data */
  const [numTotalCourses, setNumTotalCourses] = useState(0)
  const [numPendingCourses, setNumPendingCourses] = useState(0)
  const [numAcceptedCourses, setNumAcceptedCourses] = useState(0)
  const [numRejectedCourses, setNumRejectedCourses] = useState(0)

  const user = useSelector(state => state.user)

  const getChartOptions = type => {
    let title
    if (type === 'mentorship') title = 'Mentorship Listing Sales Per Time Period'
    if (type === 'course') title = 'Course Sales Per Time Period'
    if (type === 'contract') title = 'Number of Contracts By Mentorship Listing Per Time Period'
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
    if (pendingCoursesRsp && acceptedCoursesRsp && rejectedCoursesRsp)
      setNumTotalCourses(
        size(pendingCoursesRsp?.courses) +
          size(draftCoursesRsp?.courses) +
          size(acceptedCoursesRsp?.courses) +
          size(rejectedCoursesRsp?.courses),
      )
  }

  const getApplicationStats = async () => {
    const applicationData = await getSenseiMentorshipApplications(user.accountId)
    const data = map(applicationData.contracts, (c, i) => ({ ...c, key: i }))
    setNumPendingApplications(size(filter(data, ['senseiApproval', 'PENDING'])))
    setNumApprovedApplications(size(filter(data, ['senseiApproval', 'APPROVED'])))
    setNumRejectedApplications(size(filter(data, ['senseiApproval', 'REJECTED'])))
    setNumTotalApplications(size(data))
  }

  const getMenteeStats = async () => {
    const menteeData = await getMentees(user.accountId)
    const data = map(menteeData.students, (s, i) => ({ ...s, key: i }))
    setNumMentees(size(data))
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

  const getContractsByListingsData = async (queryDateStart, queryDateEnd) => {
    const listingApplications = await getListingApplications(queryDateStart, queryDateEnd)
    if (listingApplications && !isNil(listingApplications.applications)) {
      const listings = listingApplications.applications
      const contractGraphVals = []
      const contractGraphLabels = map(listings, listing => {
        const count = listing.applicationsCount
        contractGraphVals.push(count)
        return listing.name
      })
      const graphData = {
        labels: contractGraphLabels,
        datasets: [
          {
            label: 'Num Contracts Per Listing',
            backgroundColor: '#428bca',
            borderColor: '#428bca',
            borderWidth: 1,
            hoverBackgroundColor: 'rgba(158, 158, 158, 0.7)',
            hoverBorderColor: 'rgba(158, 158, 158, 0.7)',
            shadowOffsetX: 4,
            shadowOffsetY: 4,
            shadowBlur: 4,
            shadowColor: 'rgba(0, 0, 0, 0.4)',
            data: contractGraphVals,
          },
        ],
      }
      setNumContractsByApplications(graphData)
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

  const getDashboardData = async () => {
    try {
      // const consultationData = await getConsultations(dateStart, dateEnd)
      // const testimonialData = await getSenseiTestimonials(user.accountId)
      // const walletData = await viewWallet(user.walletId)

      const listingData = await getSenseiMentorshipListings(user.accountId)
      setNumListings(size(listingData))
      getCourseStats()
      getApplicationStats()
      getMenteeStats()
      getMentorshipSalesData(dftDateStart, dftDateEnd)
      getCourseSalesData(dftDateStart, dftDateEnd)
      getContractsByListingsData(dftDateStart, dftDateEnd)
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
                  onChange={values =>
                    getCourseSalesData(
                      values[0].format('YYYY-MM-DD').toString(),
                      values[1].format('YYYY-MM-DD').toString(),
                    )
                  }
                />
              </div>
            </div>
            {!isEmpty(courseGraphDt) && (
              <div className="row pl-5 pr-5 mb-4">
                <HorizontalBar
                  data={courseGraphDt}
                  width={100}
                  height={300}
                  options={getChartOptions('course')}
                />
              </div>
            )}
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
                    getContractsByListingsData(
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
            {!isEmpty(contractsByApplications) && (
              <div className="row pl-5 pr-5 mb-4">
                <HorizontalBar
                  data={contractsByApplications}
                  width={100}
                  height={300}
                  options={getChartOptions('contract')}
                />
              </div>
            )}
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
            <CountIconWidget title="Mentees" count={numMentees} icon={<TeamOutlined />} noShadow />
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
    <div>
      <Helmet title="SenseiDashboard" />
      <MentorshipAnalytics />
      <CourseAnalytics />
    </div>
  )
}

export default SenseiDashboard

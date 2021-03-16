import React, { useEffect, useState } from 'react'
import { Button } from 'antd'
import { useParams } from 'react-router-dom'
import { isNil, map } from 'lodash'
import { getAnnouncements, getCourseById } from 'services/courses'
import { ANNOUNCEMENTS, EXPAND, COLLAPSE, CREATED_AT } from 'constants/text'
import BackBtn from 'components/Common/BackBtn'
import { ArrowDownOutlined, ArrowUpOutlined } from '@ant-design/icons'
import { formatTime } from 'components/utils'

const StudentCourseDetails = () => {
  const { id } = useParams()

  const [course, setCourse] = useState([])
  const [announcements, setAnnouncements] = useState([])

  const getCourseDetails = async () => {
    const courseDetails = await getCourseById(id)
    console.log('courseDetails', courseDetails)
    if (courseDetails && !isNil(courseDetails.course)) {
      setCourse(courseDetails.course)
    }
    const courseAnnouncements = await getAnnouncements(id)
    if (courseAnnouncements && courseAnnouncements.announcements) {
      setAnnouncements(courseAnnouncements.announcements)
    }
    console.log('announcements', announcements)
    console.log('courseAnnouncements', courseAnnouncements)
  }

  useEffect(() => {
    getCourseDetails()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const CourseAnnouncementList = () => {
    const [isExpanded, setIsExpanded] = useState(false)

    const AnnouncementListInfo = data => {
      const { announcement } = data
      console.log('announcement', announcement)
      return (
        <div className="p-2">
          <h5 className="mb-0">{announcement.title}</h5>
          <small className="text-secondary">
            {`${CREATED_AT} ${formatTime(announcement.createdAt)}`}
          </small>
          <p className="mt-2">{announcement.description}</p>
        </div>
      )
    }
    console.log(announcements)
    return (
      <div className="col-12">
        <div className="card">
          <div className="card-header">
            <div className="row justify-content-between align-items-center">
              <div className="col-auto">
                <div className="text-dark h5 text-uppercase m-0">
                  <strong>{ANNOUNCEMENTS}</strong>
                </div>
              </div>
              <div className="col-auto">
                <Button
                  ghost
                  type="primary"
                  icon={!isExpanded ? <ArrowDownOutlined /> : <ArrowUpOutlined />}
                  onClick={() => setIsExpanded(!isExpanded)}
                >
                  {!isExpanded ? EXPAND : COLLAPSE}
                </Button>
              </div>
            </div>
          </div>
          <div
            className={`card-body overflow-scroll ${!isExpanded ? 'announcement-card-body' : ''}`}
          >
            {map(announcements, announcement => {
              return (
                <AnnouncementListInfo
                  key={announcement.announcementId}
                  announcement={announcement}
                />
              )
            })}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div>
      <div className="row pt-2">
        <div className="col-12 col-md-3 col-lg-2 mt-4 mt-md-0">
          <BackBtn />
        </div>
      </div>
      <div className="row mt-4">
        <div className="col-auto">
          <div className="text-dark h3">
            <strong>{course.title}</strong>
          </div>
        </div>
      </div>
      <div className="row">
        <div className="col-auto">
          <span>
            by&nbsp;
            <strong>
              {course.Sensei?.firstName} {course.Sensei?.lastName}
            </strong>
          </span>
        </div>
      </div>
      <div className="row mt-4">
        <CourseAnnouncementList />
      </div>
    </div>
  )
}

export default StudentCourseDetails

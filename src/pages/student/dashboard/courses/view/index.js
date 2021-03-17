import React, { useEffect, useState } from 'react'
import { Button, Empty } from 'antd'
import { useHistory, useParams } from 'react-router-dom'
import { isNil, map, size } from 'lodash'
import { getAnnouncements, getCourseById } from 'services/courses'
import {
  ANNOUNCEMENTS,
  EXPAND,
  COLLAPSE,
  CREATED_AT,
  LESSONS,
  VIEW_LESSON,
  COURSE_DESC,
} from 'constants/text'
import BackBtn from 'components/Common/BackBtn'
import {
  ArrowDownOutlined,
  ArrowLeftOutlined,
  ArrowRightOutlined,
  ArrowUpOutlined,
  CaretRightOutlined,
} from '@ant-design/icons'
import { formatTime } from 'components/utils'
import ScrollMenu from 'react-horizontal-scrolling-menu'

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
    return (
      <div className="card">
        <div className="card-header">
          <div className="row justify-content-between align-items-center">
            <div className="col-auto">
              <div className="text-dark h5 text-uppercase m-0">
                <strong>{ANNOUNCEMENTS}</strong>
              </div>
            </div>
            {size(announcements) > 1 && (
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
            )}
          </div>
        </div>
        <div className={`card-body overflow-scroll ${!isExpanded ? 'announcement-card-body' : ''}`}>
          {size(announcements) === 0 && <Empty />}
          {size(announcements) > 0 &&
            map(announcements, announcement => {
              return (
                <AnnouncementListInfo
                  key={announcement.announcementId}
                  announcement={announcement}
                />
              )
            })}
        </div>
      </div>
    )
  }

  const CourseLessonsList = () => {
    const history = useHistory()
    const LessonItem = data => {
      const { lesson } = data
      return (
        <div className="menu-item">
          <div className="card btn m-2 text-dark text-left">
            <div className="card-body">
              <div className="row text-2-bold-lines truncate-2-overflow">
                <div className="col-12">
                  <span className="font-weight-bold h4">{lesson.title}</span>
                </div>
              </div>
              <div className="row text-4-lines truncate-4-overflow mt-2">
                <div className="col-12">
                  <span>{lesson.description}</span>
                </div>
              </div>
              <div className="row mt-4">
                <div className="col-12">
                  <Button
                    ghost
                    type="primary"
                    size="large"
                    shape="round"
                    icon={<CaretRightOutlined />}
                    onClick={() =>
                      history.push(`/student/dashboard/courses/view-lesson/${lesson.lessonId}`)
                    }
                  >
                    {VIEW_LESSON}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )
    }

    const mapLessonItems = () => {
      return map(course.Lessons, lesson => {
        return <LessonItem key={lesson.lessonId} lesson={lesson} />
      })
    }

    const ArrowLeft = () => {
      return (
        <Button
          type="default"
          size="large"
          icon={<ArrowLeftOutlined />}
          className="scroll-menu-arrow--disabled"
        />
      )
    }

    const ArrowRight = () => {
      return (
        <Button
          type="default"
          size="large"
          icon={<ArrowRightOutlined />}
          className="scroll-menu-arrow--disabled"
        />
      )
    }

    if (size(course.Lessons) > 0)
      return (
        <div className="w-100">
          <ScrollMenu
            data={mapLessonItems()}
            alignCenter={false}
            arrowLeft={<ArrowLeft />}
            arrowRight={<ArrowRight />}
            wheel={false}
            wrapperClass="w-100"
            arrowDisabledClass="scroll-menu-arrow--disabled"
            hideArrows
            inertiaScrolling
            disableTabindex
          />
        </div>
      )
    return <Empty />
  }

  return (
    <div>
      <div className="row pt-2">
        <div className="col-12 col-md-3 col-lg-2 mt-4 mt-md-0">
          <BackBtn />
        </div>
      </div>
      <div className="row mt-5">
        <div className="col-12">
          <div className="course-img-banner-holder overflow-scroll">
            <img
              className="course-img-banner"
              alt="example"
              src={
                !isNil(course.imgUrl) ? course.imgUrl : '/resources/images/course-placeholder.png'
              }
            />
          </div>
        </div>
        <div className="col-12 mt-5">
          <div className="text-dark h3">
            <strong>{course.title}</strong>
          </div>
        </div>
      </div>
      <div className="row">
        <div className="col-12">
          <span>{course.subTitle}</span>
        </div>
      </div>
      <div className="row mt-2">
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
        <div className="col-12">
          <div className="card">
            <div className="card-header">
              <div className="text-dark h5 text-uppercase m-0">
                <strong>{COURSE_DESC}</strong>
              </div>
            </div>
            <div className="card-body">{course.description}</div>
          </div>
        </div>
        <div className="col-12">
          <CourseAnnouncementList />
        </div>
      </div>
      <div className="row mt-4">
        <div className="col-auto">
          <div className="text-dark h3">
            <strong>{LESSONS}</strong>
          </div>
        </div>
      </div>
      <div className="row mt-4 pb-5">
        <div className="col-12">
          <CourseLessonsList />
        </div>
      </div>
    </div>
  )
}

export default StudentCourseDetails

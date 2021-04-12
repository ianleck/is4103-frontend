import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import BackBtn from 'components/Common/BackBtn'
import { isNil, size } from 'lodash'
import { getCourseById, getPurchasedCourses } from 'services/courses'
import { getCommentsByLessonId, markLessonAsCompleted } from 'services/courses/lessons'
import LessonComments from 'components/Course/LessonComments'
import LessonMainContent from 'components/Course/LessonMainContent'
import CourseProgressCard from 'components/Course/ProgressCard'
import AdditionalContentCard from 'components/Course/AdditionalContentCard'
import LessonPlaylist from 'components/Course/LessonPlaylist'
import { useSelector } from 'react-redux'

const StudentCourseLesson = () => {
  const { courseId, lessonId } = useParams()

  const user = useSelector(state => state.user)

  const [currentCourse, setCurrentCourse] = useState('')
  const [currentCourseContract, setCurrentCourseContract] = useState('')
  const [currentLesson, setCurrentLesson] = useState('')
  const [percent, setPercent] = useState(0)
  const [currentVideoUrl, setCurrentVideoUrl] = useState('')
  const [comments, setComments] = useState([])

  const viewCourse = async () => {
    const result = await getCourseById(courseId)
    if (result && !isNil(result.course)) {
      setCurrentCourse(result.course)
      if (!isNil(result.course.Lessons)) {
        const viewLesson = result.course.Lessons.filter(o => o.lessonId === lessonId)
        if (size(viewLesson) > 0) {
          setCurrentLesson(viewLesson[0])
          if (!isNil(viewLesson[0].videoUrl)) {
            setCurrentVideoUrl(viewLesson[0].videoUrl)
          }
        }
      }
    }
  }

  const getLessonComments = async () => {
    const result = await getCommentsByLessonId(lessonId)
    if (result && !isNil(result.comments)) {
      setComments(result.comments)
    }
  }

  const markLessonAsCompletedSvc = async () => {
    const result = await getPurchasedCourses(user.accountId)
    if (result && !isNil(result.courses)) {
      const thisCourse = result.courses.filter(request => request.courseId === courseId)
      if (size(thisCourse) > 0 && !isNil(thisCourse[0].CourseContracts)) {
        if (size(thisCourse[0].CourseContracts) > 0) {
          setCurrentCourseContract(thisCourse[0].CourseContracts[0])
          const thisContractId = thisCourse[0].CourseContracts[0].courseContractId
          const response = await markLessonAsCompleted(thisContractId, lessonId)
          if (response && !isNil(response.courseContract) && !isNil(thisCourse[0].numLessons)) {
            setPercent(
              (
                (size(response.courseContract.lessonProgress) / thisCourse[0].numLessons) *
                100
              ).toFixed(0),
            )
          }
        }
      }
    }
  }

  useEffect(() => {
    viewCourse()
    getLessonComments()
    markLessonAsCompletedSvc()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div>
      <div className="row pt-2">
        <div className="col-12 col-md-3 col-lg-2 mt-4 mt-md-0">
          <BackBtn />
        </div>
      </div>
      <div className="row mt-5">
        <div className="col-12 col-lg-8">
          <LessonMainContent
            currentCourse={currentCourse}
            currentLesson={currentLesson}
            currentVideoUrl={currentVideoUrl}
          />
          <LessonComments
            comments={comments}
            setComments={setComments}
            lessonId={lessonId}
            currentLesson={currentLesson}
          />
        </div>
        <div className="col-12 col-lg-4">
          <CourseProgressCard percent={percent} />
          <AdditionalContentCard
            currentLesson={currentLesson}
            currentVideoUrl={currentVideoUrl}
            setCurrentVideoUrl={setCurrentVideoUrl}
          />
          <LessonPlaylist
            currentCourseContract={currentCourseContract}
            currentCourse={currentCourse}
            currentLesson={currentLesson}
            isAdmin={false}
          />
        </div>
      </div>
    </div>
  )
}

export default StudentCourseLesson

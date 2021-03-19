import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import BackBtn from 'components/Common/BackBtn'
import { isNil, size } from 'lodash'
import { getCourseById } from 'services/courses'
import { getCommentsByLessonId } from 'services/courses/lessons'
import LessonComments from 'components/Course/LessonComments'
import LessonMainContent from 'components/Course/LessonMainContent'
import CourseProgressCard from 'components/Course/ProgressCard'
import AdditionalContentCard from 'components/Course/AdditionalContentCard'
import LessonList from 'components/Course/LessonList'

const AdminCourseLesson = () => {
  const { courseId, lessonId } = useParams()

  const [currentCourse, setCurrentCourse] = useState('')
  const [currentLesson, setCurrentLesson] = useState('')
  const [currentVideoUrl, setCurrentVideoUrl] = useState('')
  const [comments, setComments] = useState([])

  useEffect(() => {
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
    viewCourse()
    getLessonComments()
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
          <CourseProgressCard />
          <AdditionalContentCard
            currentLesson={currentLesson}
            currentVideoUrl={currentVideoUrl}
            setCurrentVideoUrl={setCurrentVideoUrl}
          />
          <LessonList currentCourse={currentCourse} currentLesson={currentLesson} />
        </div>
      </div>
    </div>
  )
}

export default AdminCourseLesson

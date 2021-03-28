import React from 'react'
import { useHistory } from 'react-router-dom'
import { Button, List, Space, Typography } from 'antd'
import { EMPTY_LESSON_TITLE, LESSON_LIST } from 'constants/text'
import { ArrowLeftOutlined, ArrowRightOutlined } from '@ant-design/icons'
import { indexOf, isEmpty, isNil, map, size } from 'lodash'

const LessonList = ({ currentCourse, currentLesson, isAdmin }) => {
  const history = useHistory()
  let sortedLessonList = []
  let prevLessonId
  let nextLessonId

  const sendToLessonUrl = (sendToCourseId, sendToLessonId) => {
    if (!isAdmin)
      history.replace(`/student/dashboard/courses/${sendToCourseId}/view-lesson/${sendToLessonId}`)
    else
      history.replace(
        `/admin/course-content-management/${sendToCourseId}/view-lesson/${sendToLessonId}`,
      )
  }

  if (!isNil(currentCourse.Lessons)) {
    sortedLessonList = currentCourse.Lessons.sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    )
    const currentLessonIdx = indexOf(sortedLessonList, currentLesson)
    if (!isNil(sortedLessonList) && currentLessonIdx !== -1) {
      if (currentLessonIdx + 1 <= size(sortedLessonList) - 1)
        nextLessonId = sortedLessonList[currentLessonIdx + 1].lessonId
      if (currentLessonIdx - 1 >= 0) prevLessonId = sortedLessonList[currentLessonIdx - 1].lessonId
    }
  }

  return (
    <div className="card text-dark">
      <div className="card-header">
        <div className="row align-items-center justify-content-between">
          <div className="col-auto">
            <h5 className="mb-0" style={{ lineHeight: 'normal' }}>
              {LESSON_LIST}
            </h5>
          </div>
          <div className="col text-right">
            <Space>
              <Button
                type="default"
                size="large"
                disabled={isNil(prevLessonId)}
                icon={<ArrowLeftOutlined />}
                onClick={() => sendToLessonUrl(currentCourse.courseId, prevLessonId)}
              />
              <Button
                type="default"
                size="large"
                disabled={isNil(nextLessonId)}
                icon={<ArrowRightOutlined />}
                onClick={() => sendToLessonUrl(currentCourse.courseId, nextLessonId)}
              />
            </Space>
          </div>
        </div>
      </div>
      <div className="card-body lesson-list-card overflow-y-scroll pt-1">
        <div className="row">
          <div className="col-12">
            <List
              itemLayout="horizontal"
              dataSource={map(currentCourse.Lessons, lesson => ({
                ...lesson,
                listNumber: indexOf(sortedLessonList, lesson),
              }))}
              renderItem={item => (
                <List.Item>
                  <Typography.Text
                    code={item.lessonId === currentLesson.lessonId}
                    className="btn btn-link text-left pl-0"
                    onClick={() => sendToLessonUrl(currentCourse.courseId, item.lessonId)}
                  >
                    {`Lesson ${item.listNumber}: ${
                      !isEmpty(item.title) ? item.title : EMPTY_LESSON_TITLE
                    }`}
                  </Typography.Text>
                </List.Item>
              )}
            />
          </div>
        </div>
      </div>
    </div>
  )
}

export default LessonList

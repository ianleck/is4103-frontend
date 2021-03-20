import React from 'react'
import { Button, Empty } from 'antd'
import { useHistory } from 'react-router-dom'
import { isEmpty, map, size } from 'lodash'
import { VIEW_LESSON, EMPTY_LESSON_TITLE } from 'constants/text'
import { ArrowLeftOutlined, ArrowRightOutlined, CaretRightOutlined } from '@ant-design/icons'
import ScrollMenu from 'react-horizontal-scrolling-menu'

const CourseLessonsList = ({ course, isAdmin }) => {
  const history = useHistory()
  const LessonItem = data => {
    const { lesson, courseId } = data
    return (
      <div className="menu-item">
        <div className="card btn m-2 text-dark text-left">
          <div className="card-body">
            <div className="row text-2-bold-lines truncate-2-overflow">
              <div className="col-12">
                <span className="font-weight-bold h4">
                  {!isEmpty(lesson.title) ? lesson.title : EMPTY_LESSON_TITLE}
                </span>
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
                    !isAdmin
                      ? history.push(
                          `/student/dashboard/courses/${courseId}/view-lesson/${lesson.lessonId}`,
                        )
                      : history.push(
                          `/admin/course-content-management/${courseId}/view-lesson/${lesson.lessonId}`,
                        )
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
    return map(
      course.Lessons.sort(
        (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
      ),
      lesson => {
        return <LessonItem key={lesson.lessonId} lesson={lesson} courseId={course.courseId} />
      },
    )
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
          wrapperClass="w-100 align-items-center"
          arrowDisabledClass="scroll-menu-arrow--disabled"
          hideArrows
          inertiaScrolling
          disableTabindex
        />
      </div>
    )
  return <Empty />
}

export default CourseLessonsList

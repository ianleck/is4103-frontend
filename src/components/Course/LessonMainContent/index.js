import React, { useState } from 'react'
import { Button, Empty, Modal } from 'antd'
import {
  ABOUT_THE_COURSE,
  CLOSE,
  COURSE_DESC,
  EMPTY_LESSON_TITLE,
  EMPTY_LESSON_DESC,
  LESSON_GUIDE,
} from 'constants/text'
import ReactPlayer from 'react-player'
import { isEmpty } from 'lodash'

const LessonMainContent = ({ currentCourse, currentLesson, currentVideoUrl }) => {
  const [showLessonGuide, setShowLessonGuide] = useState(false)

  return (
    <div className="card">
      <div className="card-header">
        <div className="row align-items-center justify-content-between">
          <div className="col-12 col-md-8">
            <h3>{currentCourse.title}</h3>
            <h5>{!isEmpty(currentLesson.title) ? currentLesson.title : EMPTY_LESSON_TITLE}</h5>
          </div>
          <div className="col-12 col-md-4 text-center text-md-right">
            <Button type="primary" size="large" onClick={() => setShowLessonGuide(true)}>
              {LESSON_GUIDE}
            </Button>
          </div>
        </div>
      </div>
      <div className="card-body">
        {!isEmpty(currentVideoUrl) ? (
          <ReactPlayer controls width="100%" url={currentVideoUrl} />
        ) : (
          <Empty />
        )}
      </div>
      <Modal
        centered
        title={LESSON_GUIDE}
        visible={showLessonGuide}
        cancelText={CLOSE}
        onCancel={() => setShowLessonGuide(false)}
        okButtonProps={{ style: { display: 'none' } }}
      >
        <div className="row">
          <div className="col-12">
            <h3>{!isEmpty(currentLesson.title) ? currentLesson.title : EMPTY_LESSON_TITLE}</h3>
            <h5 className="mt-2">
              {!isEmpty(currentLesson.description) ? currentLesson.description : EMPTY_LESSON_DESC}
            </h5>
            <hr className="mt-5" />
            <h4 className="text-uppercase font-weight-bold">{ABOUT_THE_COURSE}</h4>
            <h6 className="mt-2">{currentCourse.title}</h6>
            <h6>{currentCourse.subTitle}</h6>
            <h6 className="mt-4 font-weight-bold">{COURSE_DESC}</h6>
            <span className="mt-2 text-dark">{currentCourse.description}</span>
          </div>
        </div>
      </Modal>
    </div>
  )
}

export default LessonMainContent

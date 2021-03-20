import React from 'react'
import { Progress } from 'antd'
import { COURSE_PROGRESS } from 'constants/text'

const CourseProgressCard = () => {
  return (
    <div className="card">
      <div className="card-body">
        <h5>{COURSE_PROGRESS}</h5>
        <Progress percent={50} status="active" />
      </div>
    </div>
  )
}

export default CourseProgressCard

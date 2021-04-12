import React from 'react'
import { Progress } from 'antd'
import { COURSE_PROGRESS } from 'constants/text'

const CourseProgressCard = ({ percent }) => {
  return (
    <div className="card">
      <div className="card-body">
        <h5>{COURSE_PROGRESS}</h5>
        <Progress percent={percent} status="active" />
      </div>
    </div>
  )
}

export default CourseProgressCard

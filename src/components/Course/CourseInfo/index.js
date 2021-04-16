import React from 'react'
import { Rate, Tag } from 'antd'
import { isNil, map } from 'lodash'
import { formatTime } from 'components/utils'
import { COURSE_DESC } from 'constants/text'

const CourseInfo = ({ course, children }) => {
  return (
    <div>
      <span className="h3 font-weight-bold">{course.title}</span>
      <div className="mt-2">
        <span>{course.subTitle}</span>
      </div>

      <div className="mt-2">
        <Rate disabled defaultValue={course.rating} />
      </div>

      <div className="mt-2">
        <small className="text-muted text-uppercase">
          {`Last Updated On ${formatTime(course.updatedAt)}`}
        </small>
      </div>
      <div className="mt-2">
        {map(course.Categories, category => {
          if (!isNil(category)) {
            return (
              <Tag color="geekblue" key={category?.categoryId}>
                {category?.name}
              </Tag>
            )
          }
          return <></>
        })}
      </div>

      <hr className="mt-4" />

      <div className="mt-4">
        <h3>{COURSE_DESC}</h3>
        <span className="mt-4 description-body">{course.description}</span>
      </div>
      {children}
    </div>
  )
}

export default CourseInfo

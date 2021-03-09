import React from 'react'
import { Avatar, Divider, Rate } from 'antd'
import { UserOutlined } from '@ant-design/icons'
import { random, round } from 'lodash'

const CourseListingCard = data => {
  const { course } = data
  return (
    <div className="col-12 col-md-6 col-xl-4">
      <div className="card btn text-left w-100">
        <div className="card-header p-0 text-secondary">
          <span>
            <i className="fe fe-book" />
            &nbsp;&nbsp;COURSE
          </span>
        </div>
        <img
          className="card-img-top"
          alt="example"
          src="https://gw.alipayobjects.com/zos/rmsportal/JiqGstEfoWAOHiTxclqi.png"
        />
        <div className="card-body p-3">
          <div className="card-text w-100">
            <div className="row">
              <div className="col-12">
                <span className="card-title w-100 mb-0 h5 text-dark font-weight-bold text-2-lines truncate-2-overflow">
                  {course.courseName}
                </span>
              </div>
            </div>
            <div className="row mt-2">
              <div className="col-12">
                <span className="font-weight-bold">${round(random(19.99, 39.99), 2)}</span>
              </div>
            </div>
            <div className="row">
              <div className="col-12">
                <span>
                  <Rate disabled defaultValue={random(0, 5)} />
                  <small>&nbsp;&nbsp;{random(1, 15000)}</small>
                </span>
              </div>
            </div>
            <div className="row">
              <div className="col-12">
                <span className="w-100 mt-2 text-dark text-2-lines truncate-2-overflow">
                  {course.description}
                </span>
              </div>
            </div>
          </div>
          <Divider className="mt-4 mb-3" />
          <div className="row align-items-center justify-content-between">
            <div className="col-auto">
              <Avatar size={32} icon={<UserOutlined />} />
            </div>
            <div className="col pl-0">
              <span className="p-0 text-dark text-wrap truncate-1-overflow">
                {course.instructorName}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CourseListingCard

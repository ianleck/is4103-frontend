import React from 'react'
import { Helmet } from 'react-helmet'
import { useHistory } from 'react-router-dom'
import { Button, Input, Select } from 'antd'
import { PlusOutlined } from '@ant-design/icons'

const SenseiCourses = () => {
  const history = useHistory()
  const { Option } = Select
  const { Search } = Input
  return (
    <div className="container">
      <Helmet title="My Courses" />
      <div className="row align-items-center">
        <div className="col-12 col-md-4">
          <Search placeholder="Search Courses" size="large" allowClear />
        </div>
        <div className="col-12 col-md-5 mt-4 mt-md-0">
          <Select className="w-50" size="large" placeholder="Sort by">
            <Option value="desc">Newest First</Option>
            <Option value="asc">Oldest First</Option>
          </Select>
        </div>
        <div className="col-12 col-md-3 mt-4 mt-md-0 text-center text-md-right">
          <Button
            type="primary"
            size="large"
            shape="round"
            icon={<PlusOutlined />}
            onClick={() => history.push('/sensei/courses/create')}
          >
            Add New Course
          </Button>
        </div>
      </div>
      <div className="row mt-5">
        <div className="col-auto">
          <div className="text-dark h3">
            <strong>Drafts</strong>
          </div>
        </div>
      </div>
      <div className="row mt-2">
        <div className="col-12 col-lg-6">
          <div className="card btn p-0 text-left text-dark">
            <div className="row no-gutters align-items-center sensei-course-card">
              <div className="col-3" style={{ overflow: 'scroll' }}>
                <img
                  className="sensei-course-card"
                  alt="example"
                  src="https://gw.alipayobjects.com/zos/rmsportal/JiqGstEfoWAOHiTxclqi.png"
                />
              </div>
              <div className="col-9">
                <div className="card-body">
                  <div className="d-flex align-items-start flex-column sensei-course-card-content">
                    <div className="h5 card-title truncate-2-overflow">Course Title</div>
                    <p className="card-text truncate-2-overflow">Course Description</p>
                    <div className="row w-100 align-items-center mt-auto">
                      <div className="col-12">
                        <span className="text-uppercase">Draft</span>
                      </div>
                      <div className="col-12">
                        <small className="text-uppercase text-secondary">
                          Created on 03-Mar-2021 12:50PM
                        </small>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SenseiCourses

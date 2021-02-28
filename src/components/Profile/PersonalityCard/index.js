import React from 'react'
import { Button, Empty } from 'antd'

const PersonalityCard = () => {
  return (
    <div className="card">
      <div className="card-header pb-1">
        <div className="row align-items-center justify-content-between mb-2">
          <div className="col-auto">
            <span className="h3 font-weight-bold text-dark">My Experience</span>
          </div>
          <div className="col-auto">
            <Button
              ghost
              type="primary"
              shape="round"
              size="large"
              icon={<i className="fe fe-edit-3" />}
            >
              &nbsp;&nbsp;Edit
            </Button>
          </div>
        </div>
      </div>
      <div className="card-body">
        <Empty />
      </div>
    </div>
  )
}

export default PersonalityCard

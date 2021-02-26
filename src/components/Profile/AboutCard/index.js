import React from 'react'
import { Button } from 'antd'

const AboutCard = () => {
  return (
    <div className="card">
      <div className="card-header pb-1">
        <div className="h3 font-weight-bold text-dark">About</div>
      </div>
      <div className="card-body">
        <div className="row align-items-center justify-content-between">
          <div className="col-auto">
            <span className="h4 text-dark">Headliner</span>
          </div>
          <div className="col-auto">
            <Button type="primary" shape="round" icon={<i className="fe fe-edit-3" />} size="small">
              Edit
            </Button>
          </div>
          <div className="col-12 mt-4">
            <div className="card">
              <div className="card-body">
                <span>Headliner body</span>
              </div>
            </div>
          </div>
        </div>
        <div className="row align-items-center justify-content-between">
          <div className="col-auto">
            <span className="h4 text-dark">Description</span>
          </div>
          <div className="col-auto">
            <Button type="primary" shape="round" icon={<i className="fe fe-edit-3" />} size="small">
              Edit
            </Button>
          </div>
          <div className="col-12 mt-4">
            <div className="card">
              <div className="card-body">
                <span>Description body</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AboutCard

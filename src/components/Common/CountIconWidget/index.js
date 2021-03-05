import React from 'react'
import { Statistic } from 'antd'

const CountIconWidget = ({ title, count, icon, color }) => {
  return (
    <div className="card text-dark">
      <div className="card-body">
        <div className="row">
          <div className="col-12 text-center">
            <Statistic title={title} value={count} prefix={icon} valueStyle={{ color }} />
          </div>
        </div>
      </div>
    </div>
  )
}

export default CountIconWidget

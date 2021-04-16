import React from 'react'
import { Statistic } from 'antd'
import { isNil } from 'lodash'

const CountIconWidget = ({ title, count, icon, color, className, onClick, noShadow }) => {
  return (
    <div
      role="button"
      tabIndex={0}
      className={`${!isNil(className) ? className : 'defocus-btn text-dark'} card p-0 ${noShadow &&
        'shadow-none'}`}
      onMouseDown={e => e.preventDefault()}
      onKeyDown={e => e.preventDefault()}
      onClick={onClick}
    >
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

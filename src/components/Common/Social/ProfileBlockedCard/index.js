import { StopFilled } from '@ant-design/icons'
import { Empty } from 'antd'
import React from 'react'

const ProfileBlockedCard = () => {
  return (
    <div className="card">
      <div className="card-body">
        <Empty
          image={<StopFilled style={{ fontSize: '100px' }} />}
          description={
            <>
              <span className="text-dark font-weight-bold">This profile is unavailable.</span>
              <br />
              <span className="text-muted">
                This profile is currently not available. Check back again later.
              </span>
            </>
          }
        />
      </div>
    </div>
  )
}

export default ProfileBlockedCard

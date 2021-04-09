import { LockFilled } from '@ant-design/icons'
import { Empty } from 'antd'
import React from 'react'

const ProfilePrivateCard = () => {
  return (
    <div className="card">
      <div className="card-body">
        <Empty
          image={<LockFilled style={{ fontSize: '100px' }} />}
          description={
            <>
              <span className="text-dark font-weight-bold">This account is private.</span>
              <br />
              <span className="text-muted">Follow this account to see their content.</span>
            </>
          }
        />
      </div>
    </div>
  )
}

export default ProfilePrivateCard

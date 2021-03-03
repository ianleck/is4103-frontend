import React from 'react'
import { useHistory, useParams } from 'react-router-dom'
import { Button } from 'antd'

import { CheckSquareOutlined, ArrowLeftOutlined } from '@ant-design/icons'

const MentorshipProfileHeader = () => {
  const { mentorshipListingId } = useParams()
  const history = useHistory()

  const onBack = e => {
    e.preventDefault()
    const path = '/mentorships'
    history.push(path)
  }

  const onAdd = e => {
    e.preventDefault()
    const path = `/mentorship/apply/${mentorshipListingId}`
    history.push(path)
  }

  return (
    <div
      className="row mt-4 col-auto"
      style={{
        flex: 'space-between',
        flexDirection: 'row',
        display: 'flex',
        justifyContent: 'space-between',
      }}
    >
      <Button
        type="primary"
        size="large"
        shape="round"
        onClick={onBack}
        icon={<ArrowLeftOutlined />}
      >
        Back
      </Button>

      <Button
        type="primary"
        size="large"
        shape="round"
        onClick={onAdd}
        icon={<CheckSquareOutlined />}
      >
        Apply for Mentorship
      </Button>
    </div>
  )
}

export default MentorshipProfileHeader

import React from 'react'
import { useHistory, useParams } from 'react-router-dom'
import { Button } from 'antd'

import { CheckSquareOutlined, ArrowLeftOutlined } from '@ant-design/icons'

const MentorshipProfileHeader = () => {
  const { id } = useParams()
  const history = useHistory()

  const onBack = e => {
    e.preventDefault()
    history.goBack()
  }

  const onAdd = e => {
    e.preventDefault()
    const path = `/student/mentorship/apply/${id}`
    history.push(path)
  }

  return (
    <div className="row justify-content-between">
      <div className="col-auto">
        <Button
          type="primary"
          size="large"
          shape="round"
          onClick={onBack}
          icon={<ArrowLeftOutlined />}
        >
          Back
        </Button>
      </div>
      <div className="col-auto">
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
    </div>
  )
}

export default MentorshipProfileHeader

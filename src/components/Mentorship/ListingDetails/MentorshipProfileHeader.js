import React from 'react'
import { useHistory, useParams } from 'react-router-dom'
import { Button } from 'antd'
import { CheckSquareOutlined } from '@ant-design/icons'
import { useSelector } from 'react-redux'
import BackBtn from 'components/Common/BackBtn'
import { FRONTEND_API } from 'constants/constants'
import ShareBtn from 'components/Common/Social/ShareBtn'

const MentorshipProfileHeader = data => {
  const { id } = useParams()
  const history = useHistory()
  const user = useSelector(state => state.user)
  const { children, isSubscribed, isSubscriptionApproved } = data

  const title = `${user.firstName} is sharing a Digi Dojo mentorship listing with you!`

  const onAdd = e => {
    e.preventDefault()
    const path = `/student/mentorship/apply/${id}`
    history.push(path)
  }

  return (
    <div className="row pt-2 justify-content-between">
      <div className="col-12 col-md-3 col-lg-2 mt-4 mt-md-0">
        <BackBtn />
      </div>

      <div className="col text-right mt-4 mt-md-0">
        <Button
          type="primary"
          size="large"
          disabled={isSubscribed}
          shape="round"
          onClick={onAdd}
          icon={<CheckSquareOutlined />}
        >
          Apply for Mentorship
        </Button>
      </div>
      <div className="col-auto mt-4 mt-md-0">
        <ShareBtn
          quote={title}
          url={`${FRONTEND_API}/student/mentorship/view/${id}`}
          btnType="primary"
          btnShape="round"
        />
      </div>
      {isSubscriptionApproved && children}
    </div>
  )
}

export default MentorshipProfileHeader

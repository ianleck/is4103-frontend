import React, { useState, useEffect } from 'react'
import { useHistory, useParams } from 'react-router-dom'
import { Button } from 'antd'
import { size } from 'lodash'
import { CheckSquareOutlined } from '@ant-design/icons'
import { useSelector } from 'react-redux'
import BackBtn from 'components/Common/BackBtn'
import { getAllStudentMentorshipApplications } from 'services/mentorship/applications'
import { CONTRACT_PROGRESS_ENUM, MENTORSHIP_CONTRACT_APPROVAL } from 'constants/constants'
import ShareBtn from 'components/Common/Social/ShareBtn'

const MentorshipProfileHeader = () => {
  const { id } = useParams()
  const history = useHistory()
  const user = useSelector(state => state.user)
  const [isSubscribed, setIsSubscribed] = useState(false)

  const title = `${user.firstName} is sharing a Digi Dojo mentorship listing with you!`

  const onAdd = e => {
    e.preventDefault()
    const path = `/student/mentorship/apply/${id}`
    history.push(path)
  }

  useEffect(() => {
    const checkSubscribed = async () => {
      const response = await getAllStudentMentorshipApplications(user.accountId)

      if (response && size(response.contracts) > 0) {
        for (let i = 0; i < size(response.contracts); i += 1) {
          if (
            (id === response.contracts[i].mentorshipListingId &&
              response.contracts[i].senseiApproval === MENTORSHIP_CONTRACT_APPROVAL.PENDING) ||
            (id === response.contracts[i].mentorshipListingId &&
              response.contracts[i].senseiApproval === MENTORSHIP_CONTRACT_APPROVAL.APPROVED &&
              response.contracts[i].progress !== CONTRACT_PROGRESS_ENUM.COMPLETED)
          ) {
            setIsSubscribed(true)
          }
        }
      }
    }
    checkSubscribed()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

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
          url={`http://localhost:3000/student/mentorship/view/${id}`}
          btnType="primary"
          btnShape="round"
        />
      </div>
    </div>
  )
}

export default MentorshipProfileHeader

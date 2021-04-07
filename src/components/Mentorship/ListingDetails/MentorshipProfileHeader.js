import React, { useState, useEffect } from 'react'
import { useHistory, useParams } from 'react-router-dom'
import { Button, Modal, Typography } from 'antd'
import { size } from 'lodash'
import { CheckSquareOutlined, QrcodeOutlined } from '@ant-design/icons'
import QRCode from 'react-qr-code'
import { FacebookIcon, FacebookShareButton } from 'react-share'
import { useSelector } from 'react-redux'
import BackBtn from 'components/Common/BackBtn'
import { getAllStudentMentorshipApplications } from 'services/mentorship/applications'
import { CONTRACT_PROGRESS_ENUM, MENTORSHIP_CONTRACT_APPROVAL } from 'constants/constants'

const MentorshipProfileHeader = () => {
  const { id } = useParams()
  const history = useHistory()
  const user = useSelector(state => state.user)
  const [showQRCode, setShowQRCode] = useState(false)
  const [isSubscribed, setIsSubscribed] = useState(false)

  const { Paragraph } = Typography

  const shareUrl = `http://digi.dojo/mentorship/view/${id}`
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
    <div className="row justify-content-between ">
      <div className="col-auto">
        <BackBtn />
      </div>

      <div className="col-auto d-flex justify-content-center">
        <FacebookShareButton className="mr-4" url={shareUrl} quote={title} hashtag="DigiDojo">
          <FacebookIcon size={38} round />
        </FacebookShareButton>

        <Button
          className="mr-4"
          type="primary"
          shape="round"
          icon={<QrcodeOutlined />}
          size="large"
          onClick={() => setShowQRCode(true)}
        />
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
      <Modal
        title="View QR"
        visible={showQRCode}
        cancelText="Close"
        centered
        okButtonProps={{ style: { display: 'none' } }}
        onCancel={() => setShowQRCode(false)}
      >
        <div className="row mt-3">
          <div className="col-12 text-center">
            <QRCode value={`http://localhost:3000/mentorship/view/${id}`} />
            <div className="mt-3">
              <Paragraph
                copyable={{
                  text: `http://localhost:3000/mentorship/view/${id}`,
                }}
              >
                Share Link
              </Paragraph>
            </div>
          </div>
        </div>
      </Modal>
    </div>
  )
}

export default MentorshipProfileHeader

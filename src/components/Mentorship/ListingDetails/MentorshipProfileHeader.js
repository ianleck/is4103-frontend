import React, { useState } from 'react'
import { useHistory, useParams } from 'react-router-dom'
import { Button, Modal, Typography } from 'antd'

import { CheckSquareOutlined, ArrowLeftOutlined, QrcodeOutlined } from '@ant-design/icons'
import QRCode from 'react-qr-code'
import { FacebookIcon, FacebookShareButton } from 'react-share'
import { useSelector } from 'react-redux'

const MentorshipProfileHeader = (isSubscription = false) => {
  const { id } = useParams()
  const history = useHistory()
  const user = useSelector(state => state.user)
  const [showQRCode, setShowQRCode] = useState(false)

  const { Paragraph } = Typography

  const shareUrl = `http://digi.dojo/mentorship/view/${id}`
  const title = `${user.firstName} is sharing a Digi Dojo mentorship listing with you!`

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
    <div className="row justify-content-between ">
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
      {!isSubscription ? (
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
            shape="round"
            onClick={onAdd}
            icon={<CheckSquareOutlined />}
          >
            Apply for Mentorship
          </Button>
        </div>
      ) : null}
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

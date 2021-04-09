import React, { useState } from 'react'
import { Button, Dropdown, Menu, Modal, Typography } from 'antd'
import { FacebookOutlined, QrcodeOutlined, ShareAltOutlined } from '@ant-design/icons'
import { FacebookShareButton } from 'react-share'
import QRCode from 'react-qr-code'

const ShareBtn = ({ quote, url, btnType, btnClassName, btnSize, btnShape }) => {
  const { Paragraph } = Typography
  const [showQRCode, setShowQRCode] = useState(false)

  const ShareMenu = () => {
    return (
      <Menu selectable={false}>
        <Menu.Item icon={<FacebookOutlined />} key="facebook" className="font-size-18">
          <FacebookShareButton url="digi.dojo" quote={quote} hashtag="DigiDojo">
            Facebook
          </FacebookShareButton>
        </Menu.Item>
        <Menu.Divider />
        <Menu.Item icon={<QrcodeOutlined />} key="qr" className="font-size-18">
          <a
            target="_blank"
            role="button"
            tabIndex={0}
            onClick={() => setShowQRCode(true)}
            onKeyDown={e => e.preventDefault()}
          >
            Share QR
          </a>
        </Menu.Item>
      </Menu>
    )
  }

  return (
    <div>
      <Dropdown
        overlay={<ShareMenu />}
        trigger={['click']}
        overlayStyle={{ boxShadow: '2px 3px 5px 1px rgba(0, 0, 0, .1)' }}
      >
        <Button
          type={btnType || 'default'}
          size={btnSize || 'large'}
          className={btnClassName || ''}
          shape={btnShape || false}
          icon={<ShareAltOutlined />}
        >
          Share
        </Button>
      </Dropdown>
      <Modal
        title="View QR"
        visible={showQRCode}
        cancelText="Close"
        centered
        okButtonProps={{ style: { display: 'none' } }}
        onCancel={() => setShowQRCode(false)}
        zIndex="1051"
      >
        <div className="row mt-3">
          <div className="col-12 text-center">
            <QRCode value={url} />
            <div className="mt-3">
              <Paragraph
                copyable={{
                  text: url,
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

export default ShareBtn

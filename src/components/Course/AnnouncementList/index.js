import React, { useState } from 'react'
import { Button, Empty } from 'antd'
import { map, size } from 'lodash'
import { ANNOUNCEMENTS, EXPAND, COLLAPSE, CREATED_AT } from 'constants/text'
import { ArrowDownOutlined, ArrowUpOutlined } from '@ant-design/icons'
import { formatTime } from 'components/utils'

const CourseAnnouncementList = ({ announcements }) => {
  const [isExpanded, setIsExpanded] = useState(false)

  const AnnouncementListInfo = data => {
    const { announcement } = data
    return (
      <div className="p-2">
        <h5 className="mb-0">{announcement.title}</h5>
        <small className="text-secondary">
          {`${CREATED_AT} ${formatTime(announcement.createdAt)}`}
        </small>
        <p className="mt-2">{announcement.description}</p>
      </div>
    )
  }
  return (
    <div className="card">
      <div className="card-header">
        <div className="row justify-content-between align-items-center">
          <div className="col-auto">
            <div className="text-dark h5 text-uppercase m-0">
              <strong>{ANNOUNCEMENTS}</strong>
            </div>
          </div>
          {size(announcements) > 1 && (
            <div className="col-auto">
              <Button
                ghost
                type="primary"
                icon={!isExpanded ? <ArrowDownOutlined /> : <ArrowUpOutlined />}
                onClick={() => setIsExpanded(!isExpanded)}
              >
                {!isExpanded ? EXPAND : COLLAPSE}
              </Button>
            </div>
          )}
        </div>
      </div>
      <div className={`card-body overflow-scroll ${!isExpanded ? 'announcement-card-body' : ''}`}>
        {size(announcements) === 0 && <Empty />}
        {size(announcements) > 0 &&
          map(announcements, announcement => {
            return (
              <AnnouncementListInfo key={announcement.announcementId} announcement={announcement} />
            )
          })}
      </div>
    </div>
  )
}

export default CourseAnnouncementList

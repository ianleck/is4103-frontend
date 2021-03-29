import React from 'react'
import { size } from 'lodash'
import { BookOutlined, UserSwitchOutlined } from '@ant-design/icons'
import CountIconWidget from 'components/Common/CountIconWidget'
import CountIconWidgetGroup from 'components/Common/CountIconWidgetGroup'

const UserCountIconWidget = ({
  allUsers,
  allSenseis,
  allStudents,
  currentTab,
  switchTabs,
  pendingSenseis,
  acceptedSenseis,
  rejectedSenseis,
  currentFilter,
  setTableData,
}) => {
  const AllUsersWidgetGroup = () => {
    return (
      <div className="row mt-4">
        <div className="col-12 col-md-4">
          <CountIconWidget
            title="Total Student Accounts"
            className="btn"
            count={size(allStudents)}
            icon={<BookOutlined />}
            onClick={() => switchTabs('students')}
          />
        </div>

        <div className="col-12 col-md-4">
          <CountIconWidget
            title="Total Sensei Accounts"
            className="btn"
            count={size(allSenseis)}
            icon={<i className="fa fa-graduation-cap" />}
            onClick={() => switchTabs('senseis')}
          />
        </div>

        <div className="col-12 col-md-4">
          <CountIconWidget
            title="Total Accounts"
            count={size(allUsers)}
            icon={<UserSwitchOutlined />}
          />
        </div>
      </div>
    )
  }

  const StudentWidgetGroup = () => {
    return (
      <div className="row mt-4">
        <div className="col-12 col-md-4">
          <CountIconWidget
            title="Total Student Accounts"
            count={size(allStudents)}
            icon={<BookOutlined />}
          />
        </div>
      </div>
    )
  }

  const SenseiWidgetGroup = () => {
    return (
      <CountIconWidgetGroup
        objectType="Senseis"
        currentFilter={currentFilter}
        numAccepted={size(acceptedSenseis)}
        numPending={size(pendingSenseis)}
        numRejected={size(rejectedSenseis)}
        handleAcceptedWidgetOnClick={() => setTableData('accepted')}
        handlePendingWidgetOnClick={() => setTableData('pending')}
        handleRejectedWidgetOnClick={() => setTableData('rejected')}
      />
    )
  }

  switch (currentTab) {
    case 'all':
      return <AllUsersWidgetGroup />
    case 'students':
      return <StudentWidgetGroup />
    case 'senseis':
      return <SenseiWidgetGroup />
    default:
      return <AllUsersWidgetGroup />
  }
}

export default UserCountIconWidget

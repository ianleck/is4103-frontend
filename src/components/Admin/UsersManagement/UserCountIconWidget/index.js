import React from 'react'
import { size } from 'lodash'
import {
  BookOutlined,
  CheckOutlined,
  CloseOutlined,
  ExceptionOutlined,
  UserSwitchOutlined,
} from '@ant-design/icons'
import CountIconWidget from 'components/Common/CountIconWidget'

const UserCountIconWidget = ({
  allUsers,
  allSenseis,
  allStudents,
  currentTab,
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
            title="Total Accounts"
            count={size(allUsers)}
            icon={<UserSwitchOutlined />}
          />
        </div>

        <div className="col-12 col-md-4">
          <CountIconWidget
            title="Total Student Accounts"
            count={size(allStudents)}
            icon={<BookOutlined />}
          />
        </div>

        <div className="col-12 col-md-4">
          <CountIconWidget
            title="Total Sensei Accounts"
            count={size(allSenseis)}
            icon={<i className="fa fa-graduation-cap" />}
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
            title="Total Accounts"
            count={size(allUsers)}
            icon={<UserSwitchOutlined />}
          />
        </div>

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
      <div className="row mt-4">
        <div className="col-12 col-md-4">
          <CountIconWidget
            title="Pending Senseis"
            className={`${currentFilter === 'pending' ? 'btn btn-light' : 'btn'}`}
            count={size(pendingSenseis)}
            icon={<ExceptionOutlined />}
            onClick={() => setTableData('pending')}
            color="orange"
          />
        </div>

        <div className="col-12 col-md-4">
          <CountIconWidget
            title="Accepted Senseis"
            className={`${currentFilter === 'accepted' ? 'btn btn-light' : 'btn'}`}
            count={size(acceptedSenseis)}
            icon={<CheckOutlined />}
            onClick={() => setTableData('accepted')}
            color="green"
          />
        </div>

        <div className="col-12 col-md-4">
          <CountIconWidget
            title="Rejected Senseis"
            className={`${currentFilter === 'rejected' ? 'btn btn-light' : 'btn'}`}
            count={size(rejectedSenseis)}
            icon={<CloseOutlined />}
            onClick={() => setTableData('rejected')}
            color="red"
          />
        </div>
      </div>
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

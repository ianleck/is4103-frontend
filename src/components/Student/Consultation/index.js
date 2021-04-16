import React, { useState, useEffect } from 'react'
import { useSelector } from 'react-redux'
import { useHistory } from 'react-router-dom'
import {
  CloseOutlined,
  PhoneOutlined,
  QuestionCircleOutlined,
  VideoCameraAddOutlined,
} from '@ant-design/icons'
import {
  Avatar,
  Badge,
  Button,
  Calendar,
  Descriptions,
  Divider,
  List,
  Modal,
  Popconfirm,
} from 'antd'
import {
  getConsultations,
  unregisterConsultation,
  registerConsultation,
} from 'services/mentorship/consultation'
import { isEmpty, isNil, map } from 'lodash'
import moment from 'moment'
import { getUserFullName, showNotification } from 'components/utils'
import {
  SUCCESS,
  CONSULTATION_REGISTERED,
  CONSULTATION_UNREGISTERED,
} from 'constants/notifications'
import Paragraph from 'antd/lib/typography/Paragraph'

const StudentConsultationComponent = () => {
  const user = useSelector(state => state.user)
  const history = useHistory()

  const [showConsultationDetails, setShowConsultationDetails] = useState(false)
  const [consultationDetails, setConsultationDetails] = useState([])
  const [available, setAvailable] = useState(true) // Flag if the slot has been booked by someone
  const [booked, setBooked] = useState(false) // Flag for booked by you
  const [isPast, setIsPast] = useState(false) // Flag to check if the slot is in a past date

  const [selectedDate, setSelectedDate] = useState(new Date().toString())
  const [monthStart, setMonthStart] = useState(new Date().toString())
  const [monthEnd, setMonthEnd] = useState(new Date().toString())

  const [consultations, setConsultations] = useState([])

  const retrieveConsultations = async () => {
    const date = new Date()
    const firstDay = new Date(date.getFullYear() - 1, 0, 1)
    const lastDay = new Date(date.getFullYear() + 1, 12, 0)

    setMonthStart(firstDay.toString())
    setMonthEnd(lastDay.toString())

    const response = await getConsultations(firstDay, lastDay)

    if (response && !isNil(response.consultationSlots)) {
      setConsultations(response.consultationSlots)
    }
  }

  const onDateSelect = values => {
    const date = new Date(values.format())
    const firstDay = new Date(date.getFullYear() - 1, 0, 1)
    const lastDay = new Date(date.getFullYear() + 1, 12, 0)

    setMonthStart(firstDay.toString())
    setMonthEnd(lastDay.toString())
    setSelectedDate(values.toString())
    refreshConsultations()
  }

  const refreshConsultations = async () => {
    const response = await getConsultations(monthStart, monthEnd)

    if (response && !isNil(response.consultationSlots)) {
      setConsultations(response.consultationSlots)
    }
  }

  const formatDate = record => {
    // Format date in DD/MM/YYYY format
    const date = new Date(record)
    const d = `${date.getDate()}/0${date.getMonth() + 1}/${date.getFullYear()}`
    return d
  }

  const formatTime = record => {
    const date = new Date(record).getTime()
    const time = moment(date).format('HH:mm')
    return time
  }

  const dateCellRender = values => {
    let match = false
    let matchedConsult = []

    consultations.forEach(consult => {
      if (values.format('MM/DD/YYYY') === moment(consult.timeStart).format('MM/DD/YYYY')) {
        match = true
        matchedConsult = [...matchedConsult, consult]
      }
    })

    if (match) {
      return (
        <ul className="m-0 p-0">
          {map(matchedConsult, item => (
            <li key={item.consultationId}>
              <Badge
                status={isEmpty(item.studentId) ? 'success' : 'error'}
                text={!isEmpty(item) ? `${formatTime(item.timeStart)}` : null}
              />
            </li>
          ))}
        </ul>
      )
    }
    return null
  }

  const compareItemDateToSelectedDate = item => {
    const consTime = moment(item.timeStart).format('MM/DD/YYYY')

    const date = new Date(selectedDate).getTime()
    const chosenD = moment(date).format('MM/DD/YYYY')

    if (consTime === chosenD) {
      return true
    }
    return false
  }

  const joinCall = () => {
    history.push(`/student/consultation/${consultationDetails.consultationId}`)
  }

  const getConsultationListOfDay = () => {
    let listOfConsult = []

    consultations.forEach(con => {
      if (compareItemDateToSelectedDate(con)) {
        listOfConsult = [...listOfConsult, con]
      }
    })

    return (
      <List
        itemLayout="horizontal"
        dataSource={listOfConsult}
        renderItem={item => <List.Item>{populateConsultData(item)}</List.Item>}
      />
    )
  }

  const selectConsultation = record => {
    checkIfBooked(record)
    checkIfPast(record)
    setConsultationDetails(record)
    setShowConsultationDetails(true)
  }

  const checkIfBooked = record => {
    if (isNil(record.studentId)) {
      setAvailable(true)
    } else {
      setAvailable(false)
    }

    if (record.studentId === user.accountId) {
      setBooked(true)
    } else {
      setBooked(false)
    }
  }

  const checkIfPast = record => {
    if (moment(record.timeStart) < moment()) {
      setIsPast(true)
    }
  }

  const onBookConsultation = async () => {
    const response = await registerConsultation(
      consultationDetails.consultationId,
      monthStart,
      monthEnd,
    )

    if (response) {
      refreshConsultations()
      setShowConsultationDetails(false)
      showNotification('success', SUCCESS, CONSULTATION_REGISTERED)
    }
  }

  const onCancelConsultation = async () => {
    const response = await unregisterConsultation(
      consultationDetails.consultationId,
      monthStart,
      monthEnd,
    )

    if (response) {
      refreshConsultations()
      setShowConsultationDetails(false)
      showNotification('success', SUCCESS, CONSULTATION_UNREGISTERED)
    }
  }

  const consultationFooter = (
    <div className="row justify-content-between">
      <div className="col-auto">
        <Button
          type="default"
          size="large"
          onClick={() => setShowConsultationDetails(false)}
          icon={<CloseOutlined />}
        >
          Close
        </Button>
      </div>
      <div className="col-auto">
        <Popconfirm
          title="Are you sure you wish to book this consultation?"
          icon={<QuestionCircleOutlined className="text-danger" />}
          disabled={!available || isPast}
          onConfirm={() => onBookConsultation()}
        >
          <Button
            type="primary"
            size="large"
            disabled={!available || isPast}
            icon={<VideoCameraAddOutlined />}
          >
            Book Consultation
          </Button>
        </Popconfirm>
      </div>
    </div>
  )

  const bookedFooter = (
    <div className="row justify-content-between">
      <div className="col-auto">
        <Popconfirm
          title="Are you sure you wish to cancel this consultation?"
          icon={<QuestionCircleOutlined className="text-danger" />}
          onConfirm={() => onCancelConsultation()}
        >
          <Button type="default" danger size="large" icon={<CloseOutlined />}>
            Cancel Consultation
          </Button>
        </Popconfirm>
      </div>
      <div className="col-auto">
        <Button type="primary" size="large" icon={<PhoneOutlined />} onClick={() => joinCall()}>
          Join Call
        </Button>
      </div>
    </div>
  )

  const populateConsultData = item => {
    return (
      <div
        role="button"
        tabIndex={0}
        className="btn border-0 text-left w-100 mt-4"
        onClick={() => selectConsultation(item)}
        onKeyDown={event => event.preventDefault()}
      >
        <div className="row align-items-center">
          <div className="col-auto pl-2">
            <Avatar size={64} src={item.Sensei.profileImgUrl} />
          </div>
          <div className="col pl-2">
            <h5 className="truncate-2-overflow text-wrap font-weight-bold">{item.title}</h5>
            <span className="mb-2 h6 text-dark text-uppercase text-wrap">
              {`${item.Sensei.firstName} ${item.Sensei.lastName}`}
            </span>
            <div className="truncate-2-overflow text-wrap text-muted">
              {item.MentorshipListing.name}
            </div>
            <div className="truncate-2-overflow text-wrap text-muted">
              {`${formatTime(item.timeStart)} - ${formatTime(item.timeEnd)}`}
            </div>
            {isNil(item.studentId) && (
              <div className="truncate-2-overflow text-wrap text-muted">
                <Badge status="success" text="Available" />
              </div>
            )}
            {!isNil(item.studentId) && (
              <div className="truncate-2-overflow text-wrap text-muted">
                <Badge status="error" text={`Booked by ${getUserFullName(item.Student)}`} />
              </div>
            )}
          </div>
        </div>
      </div>
    )
  }

  useEffect(() => {
    retrieveConsultations()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div className="row">
      <div className="col-12">
        <div className="card">
          <div className="card-header">
            <div className="row justify-content-between align-items-center">
              <div className="col-12 col-sm-auto text-center text-sm-left">
                <h5 className="mb-0">Consultations</h5>
              </div>
            </div>
          </div>

          <div className="card-body">
            <div className="row">
              <div className="col-12 col-md-8">
                <Calendar
                  onSelect={record => {
                    onDateSelect(record)
                  }}
                  dateCellRender={record => dateCellRender(record)}
                />
              </div>

              <div className="col-12 col-md-4">
                <p className="text-dark mt-4">
                  <strong>{`List of Consultations on ${formatDate(selectedDate)}`}</strong>
                </p>
                <Divider />
                <div className="card-body pt-1 mt-2 consultation-list-card overflow-y-scroll">
                  <div className="row">
                    <div className="col-12">{getConsultationListOfDay()}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Modal
        visible={showConsultationDetails}
        title="Consultation Details"
        cancelText="Close"
        centered
        onCancel={() => setShowConsultationDetails(false)}
        footer={booked ? bookedFooter : consultationFooter}
      >
        <Descriptions column={1}>
          <Descriptions.Item label="Mentorship Title">
            {consultationDetails.MentorshipListing
              ? consultationDetails.MentorshipListing.name
              : '-'}
          </Descriptions.Item>
          <Descriptions.Item label="Mentorship Description">
            <Paragraph ellipsis={{ rows: 1, expandable: true, symbol: 'More' }}>
              {consultationDetails.MentorshipListing
                ? consultationDetails.MentorshipListing.description
                : null}
            </Paragraph>
          </Descriptions.Item>
          <Descriptions.Item label="Pass Price">
            {consultationDetails.MentorshipListing
              ? parseFloat(consultationDetails.MentorshipListing.priceAmount).toFixed(2)
              : null}
          </Descriptions.Item>
          <Descriptions.Item label="Consultation ID">
            {consultationDetails.consultationId}
          </Descriptions.Item>
          <Descriptions.Item label="Consultation Title">
            {consultationDetails.title}
          </Descriptions.Item>
          <Descriptions.Item label="Consultation Time">
            {`${formatTime(consultationDetails.timeStart)} - ${formatTime(
              consultationDetails.timeEnd,
            )}`}
          </Descriptions.Item>
          {isNil(consultationDetails.studentId) && (
            <div className="truncate-2-overflow text-wrap text-muted">
              <Badge status="success" text="Available" />
            </div>
          )}
          {!isNil(consultationDetails.studentId) && (
            <div className="truncate-2-overflow text-wrap text-muted">
              <Badge
                status="error"
                text={`Booked by ${getUserFullName(consultationDetails.Student)}`}
              />
            </div>
          )}
        </Descriptions>
      </Modal>
    </div>
  )
}

export default StudentConsultationComponent

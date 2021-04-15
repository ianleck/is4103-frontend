import React, { useState, useEffect } from 'react'
import { useSelector } from 'react-redux'
import { useHistory } from 'react-router-dom'
import { CloseOutlined, PhoneOutlined, PlusOutlined } from '@ant-design/icons'
import {
  Avatar,
  Badge,
  Button,
  Calendar,
  DatePicker,
  Descriptions,
  Divider,
  Form,
  Input,
  List,
  Modal,
  Select,
  TimePicker,
} from 'antd'
import {
  getConsultations,
  createConsultation,
  deleteConsultation,
} from 'services/mentorship/consultation'
import { isEmpty, isNil, map } from 'lodash'
import { getSenseiMentorshipListings } from 'services/mentorship/listings'
import moment from 'moment'
import { showNotification } from 'components/utils'
import { SUCCESS, CONSULTATION_CREATED, CONSULTATION_DELETED } from 'constants/notifications'
import Paragraph from 'antd/lib/typography/Paragraph'
import { getAllStudentMentorshipApplications } from 'services/mentorship/applications'

const { Option } = Select

const StudentConsultationComponent = () => {
  const user = useSelector(state => state.user)
  const history = useHistory()
  const [showAddConsultationModal, setShowAddConsultationModal] = useState(false)

  const [showConsultationDetails, setShowConsultationDetails] = useState(false)
  const [consultationDetails, setConsultationDetails] = useState([])

  const [selectedDate, setSelectedDate] = useState(new Date().toString())
  const [monthStart, setMonthStart] = useState(new Date().toString())
  const [monthEnd, setMonthEnd] = useState(new Date().toString())

  const [consultations, setConsultations] = useState([])
  const [listings, setListings] = useState([]) // to Be deleted
  const [contracts, setContracts] = useState([])

  console.log('consultations', consultations)
  console.log('contracts', contracts)

  const retrieveConsultations = async () => {
    const date = new Date()
    const firstDay = new Date(date.getFullYear(), date.getMonth(), 1)
    const lastDay = new Date(date.getFullYear(), date.getMonth() + 1, 0)

    setMonthStart(firstDay.toString())
    setMonthEnd(lastDay.toString())

    const response = await getConsultations(firstDay, lastDay)

    if (response && !isNil(response.consultationSlots)) {
      setConsultations(response.consultationSlots)
    }
  }

  const retrieveListing = async () => {
    const response = await getSenseiMentorshipListings(user.accountId)
    if (response) {
      setListings(response)
    }
  }

  const retrieveContracts = async () => {
    const response = await getAllStudentMentorshipApplications(user.accountId)
    if (response) {
      const cons = response.contracts.filter(c => c.senseiApproval === 'APPROVED')
      setContracts(cons)
    }
  }

  const onDateSelect = values => {
    const date = new Date(values.format())
    const firstDay = new Date(date.getFullYear(), date.getMonth(), 1)
    const lastDay = new Date(date.getFullYear(), date.getMonth() + 1, 0)

    setMonthStart(firstDay.toString())
    setMonthEnd(lastDay.toString())
    setSelectedDate(values.toString())
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

  const panelChanged = () => {
    retrieveConsultations()
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

  const onFinishFailed = errorInfo => {
    console.log('Failed:', errorInfo)
  }

  const addNewConsultationFormFooter = (
    <div className="row justify-content-between">
      <div className="col-auto">
        <Button type="default" size="large" onClick={() => setShowAddConsultationModal(false)}>
          Cancel
        </Button>
      </div>
      <div className="col-auto">
        <Button type="primary" form="createConsultationForm" htmlType="submit" size="large">
          Add New Consultation
        </Button>
      </div>
    </div>
  )

  const onAddNewConsultation = async values => {
    const title = values.name
    const mentorshipListingId = values.id

    const startDateTime = `${values.date.format('MM/DD/YYYY')} ${values.timeStart
      .format('HH:mm:ss')
      .toString()}`
    const timeStart = new Date(startDateTime).toString()

    const endDateTime = `${values.date.format('MM/DD/YYYY')} ${values.timeEnd
      .format('HH:mm:ss')
      .toString()}`

    const timeEnd = new Date(endDateTime).toString()
    const payload = { title, mentorshipListingId, timeStart, timeEnd }
    const response = await createConsultation(monthStart, monthEnd, payload)

    if (response) {
      retrieveConsultations()
      setShowAddConsultationModal(false)
      showNotification('success', SUCCESS, CONSULTATION_CREATED)
    }
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

  const startCall = () => {
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
    setConsultationDetails(record)
    setShowConsultationDetails(true)
  }

  const onCancelConsultation = async () => {
    const response = await deleteConsultation(
      consultationDetails.consultationId,
      monthStart,
      monthEnd,
    )

    if (response) {
      retrieveConsultations()
      setShowConsultationDetails(false)
      showNotification('success', SUCCESS, CONSULTATION_DELETED)
    }
  }

  const consultationDetailFormFooter = (
    <div className="row justify-content-between">
      <div className="col-auto">
        <Button
          type="default"
          danger
          size="large"
          onClick={() => onCancelConsultation()}
          icon={<CloseOutlined />}
        >
          Cancel Consultation
        </Button>
      </div>
      <div className="col-auto">
        <Button type="primary" size="large" icon={<PhoneOutlined />} onClick={() => startCall()}>
          Start Call
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
                <Badge status="error" text={`Booked by ${item.studentId}`} />
              </div>
            )}
          </div>
        </div>
      </div>
    )
  }

  useEffect(() => {
    retrieveConsultations()
    retrieveListing()
    retrieveContracts()
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
              <div className="col-12 col-sm-auto mt-3 mt-sm-0 text-center text-sm-right">
                <Button
                  type="primary"
                  size="large"
                  shape="round"
                  onClick={() => setShowAddConsultationModal(true)}
                  icon={<PlusOutlined />}
                >
                  Add New Consultation
                </Button>
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
                  onPanelChange={() => panelChanged()}
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
        footer={consultationDetailFormFooter}
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
              <Badge status="error" text={`Booked by ${consultationDetails.studentId}`} />
            </div>
          )}
        </Descriptions>
      </Modal>

      <Modal
        visible={showAddConsultationModal}
        title="Add new Consultation"
        cancelText="Close"
        centered
        onCancel={() => setShowAddConsultationModal(false)}
        footer={addNewConsultationFormFooter}
      >
        <Form
          id="createConsultationForm"
          layout="vertical"
          hideRequiredMark
          onSubmit={e => e.preventDefault()}
          onFinish={onAddNewConsultation}
          onFinishFailed={onFinishFailed}
          initialValues={{
            date: moment(formatDate(selectedDate), 'DD/MM/YYYY'),
          }}
        >
          <Form.Item
            label="Title of Consultation"
            name="name"
            rules={[{ required: true, message: 'Please input a title for your consultation.' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Mentorship Listing"
            name="id"
            rules={[
              {
                required: true,
                message: 'Please select the mentorship listing the consultation is tied to.',
              },
            ]}
          >
            <Select placeholder="Select Mentorship Listing">
              {map(listings, listing => {
                return (
                  <Option value={listing.mentorshipListingId} key={listing.mentorshipListingId}>
                    {listing.name}
                  </Option>
                )
              })}
            </Select>
          </Form.Item>
          <Form.Item label="Date of Consultation" name="date">
            <DatePicker />
          </Form.Item>
          <Form.Item
            label="Start Time of Consultation"
            name="timeStart"
            rules={[
              { required: true, message: 'Please input a start time for your consultation.' },
            ]}
          >
            <TimePicker format="HH:mm" />
          </Form.Item>
          <Form.Item
            label="End Time of Consultation"
            name="timeEnd"
            rules={[{ required: true, message: 'Please input a end time for your consultation.' }]}
          >
            <TimePicker format="HH:mm" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  )
}

export default StudentConsultationComponent

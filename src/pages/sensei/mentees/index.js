import { EyeOutlined } from '@ant-design/icons'
import { Button, Modal, Skeleton, Table } from 'antd'
import StatusTag from 'components/Common/StatusTag'
import MenteeChart from 'components/Sensei/MenteeChart'
import { formatTime } from 'components/utils'
import { CONTRACT_PROGRESS_ENUM, MENTORSHIP_CONTRACT_APPROVAL } from 'constants/constants'
import { isNil, map, size } from 'lodash'
import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { useHistory } from 'react-router-dom'
import { getMentees } from 'services/mentorship/subscription'

const MenteeOverviewPage = () => {
  const history = useHistory()
  const user = useSelector(state => state.user)
  const [mentees, setMentees] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [showMentorshipContractModal, setShowMentorshipContractModal] = useState(false)
  const [studentMentorshipContract, setStudentMentorshipContract] = useState([])

  const { accountId } = user

  useEffect(() => {
    const getAllMentees = async () => {
      const response = await getMentees(accountId)
      if (response && !isNil(response.students)) {
        const data = map(response.students, (s, i) => ({ ...s, key: i }))

        let men = []

        for (let i = 0; i < data.length; i += 1) {
          for (let j = 0; j < data[i].MentorshipContracts.length; j += 1) {
            if (
              data[i].MentorshipContracts[j].senseiApproval ===
              MENTORSHIP_CONTRACT_APPROVAL.APPROVED
            ) {
              men = [...men, data[i]]
            }
          }
        }

        setMentees(men)
      }
      setIsLoading(false)
    }

    getAllMentees()
  }, [accountId])

  const handleViewMentorshipContract = record => {
    setStudentMentorshipContract(record.MentorshipContracts)
    setShowMentorshipContractModal(true)
  }

  const tableColumns = [
    {
      title: 'First Name',
      dataIndex: 'firstName',
      key: 'firstName',
      width: '20%',
    },
    {
      title: 'Last Name',
      dataIndex: 'lastName',
      key: 'lastName',
      responsive: ['md'],
      width: '20%',
    },
    {
      title: 'Username',
      dataIndex: 'username',
      key: 'username',
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
      responsive: ['md'],
    },
    {
      title: 'Action',
      key: 'action',
      render: record => (
        <Button
          type="primary"
          size="large"
          shape="circle"
          icon={<EyeOutlined />}
          onClick={() => handleViewMentorshipContract(record)}
        />
      ),
    },
  ]

  const showMentees = (dataSource, columns) => {
    const numMentees = size(dataSource)

    return (
      <div>
        <div className="row justify-content-between align-items-center mt-2">
          <div className="col-auto">
            You currently have {numMentees} {numMentees === 1 ? 'mentee' : 'mentees'}.
          </div>
        </div>
        <Table className="mt-4" dataSource={dataSource} columns={columns} />
      </div>
    )
  }

  const onCreateTestimonial = (studentId, listingId) => {
    const path = `/sensei/testimonial/${listingId}/${studentId}`
    history.push(path)
  }

  const showAddTestimonialButton = (studentId, listingId) => (
    <div>
      <Button
        ghost
        size="small"
        type="primary"
        onClick={() => {
          onCreateTestimonial(studentId, listingId)
        }}
      >
        Add Testimonial
      </Button>
    </div>
  )

  return (
    <Skeleton active loading={isLoading}>
      <div className="card">
        <div className="card-header card-header-flex">
          <div className="d-flex flex-column justify-content-center mr-auto">
            <h5 className="mb-0">Mentee Overview</h5>
          </div>
        </div>
        <div className="card-body">{showMentees(mentees, tableColumns)}</div>
      </div>

      <MenteeChart accountId={accountId} />

      <Modal
        visible={showMentorshipContractModal}
        title="View Mentorship Contract(s)"
        cancelText="Close"
        centered
        okButtonProps={{ style: { display: 'none' } }}
        onCancel={() => setShowMentorshipContractModal(false)}
        bodyStyle={{ height: 500, overflow: 'scroll' }}
      >
        {map(studentMentorshipContract, contract => (
          <div key={contract.mentorshipContractId} className="card">
            <div className="card-body">
              <p>
                <strong>Progress: </strong>
                <StatusTag data={contract.progress} type="CONTRACT_PROGRESS_ENUM" />
              </p>
              <p>
                <strong>Approval Status: </strong>
                <StatusTag data={contract.senseiApproval} type="MENTORSHIP_CONTRACT_APPROVAL" />
              </p>
              <p>
                <strong>Listing Id: </strong>
                {contract.mentorshipListingId}
              </p>
              <p>
                <strong>Contract Id: </strong>
                {contract.mentorshipContractId}
              </p>
              {contract.progress === CONTRACT_PROGRESS_ENUM.COMPLETED &&
                showAddTestimonialButton(contract.accountId, contract.mentorshipListingId)}
            </div>
            <div className="card-footer pb-0 pr-0">
              <p className="text-muted">Created At: {formatTime(contract.createdAt)}</p>
            </div>
          </div>
        ))}
      </Modal>
    </Skeleton>
  )
}

export default MenteeOverviewPage

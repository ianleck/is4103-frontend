import { EyeOutlined } from '@ant-design/icons'
import { Button, Table } from 'antd'
import StatusTag from 'components/Common/StatusTag'
import { formatTime } from 'components/utils'
import { CONTRACT_PROGRESS_ENUM_FILTER } from 'constants/filters'
import { isNil, map, size } from 'lodash'
import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { useHistory } from 'react-router-dom'
import { getSenseiMentorshipContracts } from 'services/mentorship/contracts'

const SenseiMentorshipContracts = () => {
  const history = useHistory()
  const user = useSelector(state => state.user)
  const [mentorshipContracts, setMentorshipContracts] = useState([])

  const { accountId } = user

  const getMentorshipContracts = async () => {
    const response = await getSenseiMentorshipContracts(accountId)
    if (response && !isNil(response.contracts)) {
      setMentorshipContracts(map(response.contracts, (c, i) => ({ ...c, key: i })))
    }
  }

  useEffect(() => {
    getMentorshipContracts()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const showMentorshipContracts = (dataSource, columns) => {
    const numContracts = size(dataSource)

    return (
      <div>
        <div className="row justify-content-between align-items-center mt-2">
          <div className="col-auto">
            You currently have {numContracts} {numContracts === 1 ? 'contract' : 'contracts'}.
          </div>
        </div>
        <Table className="mt-4" dataSource={dataSource} columns={columns} />
      </div>
    )
  }

  const viewMentorshipContract = record => {
    const path = `/sensei/mentorships/contract/${record.mentorshipContractId}`
    history.push(path)
  }

  const tableColumns = [
    {
      title: 'Mentorship Contract ID',
      dataIndex: 'mentorshipContractId',
      key: 'mentorshipContractId',
      width: '15%',
    },
    {
      title: 'First Name of Mentee',
      dataIndex: ['Student', 'firstName'],
      key: 'firstName',
      width: '10%',
      sorter: (a, b) =>
        !isNil(a.Student.firstName) && !isNil(b.Student.firstName)
          ? a.Student.firstName.length - b.Student.firstName.length
          : '',
      sortDirections: ['ascend', 'descend'],
    },
    {
      title: 'Last Name of Mentee',
      dataIndex: ['Student', 'lastName'],
      key: 'lastName',
      width: '10%',
      responsive: ['md'],
      sorter: (a, b) =>
        !isNil(a.Student.lastName) && !isNil(b.Student.lastName)
          ? a.Student.lastName.length - b.Student.lastName.length
          : '',
      sortDirections: ['ascend', 'descend'],
    },
    {
      title: 'Date Applied',
      dataIndex: 'createdAt',
      key: 'createdAt',
      width: '15%',
      render: record => formatTime(record),
      responsive: ['lg'],
      sorter: (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
      sortDirections: ['ascend', 'descend'],
    },
    {
      title: 'Mentorship Title',
      dataIndex: ['MentorshipListing', 'name'],
      key: 'mentorshipTitle',
      responsive: ['sm'],
      sorter: (a, b) => a.MentorshipListing.name.length - b.MentorshipListing.name.length,
      sortDirections: ['ascend', 'descend'],
    },
    {
      title: 'Progress',
      key: 'progress',
      dataIndex: 'progress',
      width: '15%',
      render: record => <StatusTag data={record} type="CONTRACT_PROGRESS_ENUM" />,
      filters: CONTRACT_PROGRESS_ENUM_FILTER,
      onFilter: (value, record) => record.progress.indexOf(value) === 0,
    },
    {
      title: 'Action',
      key: 'action',
      render: record => (
        <Button
          type="default"
          shape="circle"
          size="large"
          icon={<EyeOutlined />}
          onClick={() => viewMentorshipContract(record)}
        />
      ),
    },
  ]

  return (
    <div className="card">
      <div className="card-header card-header-flex">
        <div className="d-flex flex-column justify-content-center mr-auto">
          <h5 className="mb-0">Mentorship Contracts</h5>
        </div>
      </div>
      <div className="card-body">{showMentorshipContracts(mentorshipContracts, tableColumns)}</div>
    </div>
  )
}

export default SenseiMentorshipContracts

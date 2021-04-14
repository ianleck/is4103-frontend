import { Table } from 'antd'
import { size } from 'lodash'
import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { getSenseiMentorshipContracts } from 'services/mentorship/subscription'

const SenseiMentorshipContracts = () => {
  const user = useSelector(state => state.user)
  const [mentorshipContracts, setMentorshipContracts] = useState([])

  const { accountId } = user

  const getMentorshipContracts = async () => {
    const response = await getSenseiMentorshipContracts(accountId)
    console.log('response is ', response)
    setMentorshipContracts([])
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

  const tableColumns = [] // to change

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

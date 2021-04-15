import BackBtn from 'components/Common/BackBtn'
import NotesComponent from 'components/Mentorship/Notes'
import TaskComponent from 'components/Mentorship/Task'
import { isNil } from 'lodash'
import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { getContract } from 'services/mentorship/contracts'

const MentorshipContract = () => {
  const { id } = useParams()
  const [contract, setContract] = useState([])

  const getMentorshipContract = async () => {
    const response = await getContract(id)
    if (response && !isNil(response.contract)) {
      setContract(response.contract)
    }
  }

  useEffect(() => {
    getMentorshipContract()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div>
      <div className="row pt-2 justify-content-between">
        <div className="col-12 col-md-3 col-lg-2 mt-4 mt-md-0">
          <BackBtn />
        </div>
      </div>
      <div className="row pl-4 mt-4">
        <div className="h5 font-weight-bold">
          {`Mentorship Contract: `}
          <span>{contract.mentorshipContractId}</span>
        </div>
      </div>
      <TaskComponent />
      <br />
      <NotesComponent />
    </div>
  )
}

export default MentorshipContract

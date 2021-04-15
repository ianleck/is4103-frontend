import { CheckOutlined } from '@ant-design/icons'
import { Button, Popconfirm, Progress } from 'antd'
import BackBtn from 'components/Common/BackBtn'
import NotesComponent from 'components/Mentorship/Notes'
import TaskComponent from 'components/Mentorship/Task'
import { calculateOverallProgress, showNotification } from 'components/utils'
import { CONTRACT_PROGRESS_ENUM } from 'constants/constants'
import {
  CONTRACT_COMPLETE_ERR,
  CONTRACT_COMPLETE_SUCCESS,
  ERROR,
  SUCCESS,
} from 'constants/notifications'
import { isNil } from 'lodash'
import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { getContract, terminateMentorshipContract } from 'services/mentorship/contracts'

const MentorshipContract = () => {
  const { id } = useParams()
  const [contract, setContract] = useState([])
  const [overallTaskProgress, setOverallTaskProgress] = useState(0)
  const [showCompletePopConfirm, setShowCompletePopConfirm] = useState(false)
  const [isContractOngoing, setisContractOngoing] = useState(false)

  const getMentorshipContract = async () => {
    const response = await getContract(id)
    if (response && !isNil(response.contract)) {
      setContract(response.contract)
      if (!isNil(response.contract.TaskBuckets)) {
        setOverallTaskProgress(calculateOverallProgress(response.contract.TaskBuckets))
      }
      if (!isNil(response.contract.progress)) {
        setisContractOngoing(response.contract.progress === CONTRACT_PROGRESS_ENUM.ONGOING)
      }
    }
  }

  useEffect(() => {
    getMentorshipContract()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const onCompleteContract = async () => {
    const response = await terminateMentorshipContract({
      mentorshipContractId: id,
      action: CONTRACT_PROGRESS_ENUM.COMPLETED,
    })

    if (response) {
      showNotification('success', SUCCESS, CONTRACT_COMPLETE_SUCCESS)
      getMentorshipContract()
      setShowCompletePopConfirm(false)
    } else {
      showNotification('error', ERROR, CONTRACT_COMPLETE_ERR)
    }
  }

  const getPopconfirmTitle = () => {
    const main = 'Do you wish to mark this mentorship contract as completed? '

    const addendum =
      overallTaskProgress < 100
        ? 'There are still incomplete tasks.'
        : 'All tasks have been completed.'

    return main + addendum
  }

  const DetailsComponent = () => (
    <div className="card">
      <div className="card-body">
        <div className="card-title"> Mentorship Contract:</div>
        <div className="card-text">{contract.mentorshipContractId}</div>
      </div>
      <small className="card-footer">Progress: {contract.progress}</small>
    </div>
  )

  const ProgressComponent = () => (
    <div className="card">
      <div className="card-body">
        <small className="text-muted">Overall Tasks Progress</small>
        <Progress percent={overallTaskProgress} size="small" />
        <hr />
        <div className="row">
          <div className="col-12">
            <Popconfirm
              title={getPopconfirmTitle()}
              onConfirm={() => onCompleteContract()}
              onCancel={() => setShowCompletePopConfirm(false)}
              okText="Yes"
              okType="danger"
              visible={showCompletePopConfirm}
              placement="bottom"
            >
              <Button
                block
                type="default"
                size="large"
                onClick={() => setShowCompletePopConfirm(true)}
                icon={<CheckOutlined className="text-success" />}
                disabled={!isContractOngoing}
              >
                Complete Mentorship
              </Button>
            </Popconfirm>
          </div>
        </div>
      </div>
    </div>
  )

  return (
    <div>
      <div className="row pt-2 justify-content-between">
        <div className="col-12 col-md-3 col-lg-2 mt-4 mt-md-0">
          <BackBtn />
        </div>
      </div>
      <div className="row pt-4">
        <div className="col-12 col-lg-7">
          <DetailsComponent />
        </div>
        <div className="col-12 col-lg-5">
          <ProgressComponent />
        </div>
      </div>
      <TaskComponent isEditable={isContractOngoing} />
      <br />
      <NotesComponent isEditable={isContractOngoing} />
    </div>
  )
}

export default MentorshipContract

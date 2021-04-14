import { Empty, Progress } from 'antd'
import { formatTime, getUserFullName } from 'components/utils'
import { TASK_PROGRESS } from 'constants/constants'
import { isEmpty, isNil, map, size } from 'lodash'
import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { useHistory } from 'react-router-dom'
import { getActiveMentorshipContractList } from 'services/mentorship/contracts'

const StudentMentorships = () => {
  const user = useSelector(state => state.user)
  const [activeMentorships, setActiveMentorships] = useState([])
  const history = useHistory()

  const { accountId } = user

  const getOngoingMentorshipContracts = async () => {
    const response = await getActiveMentorshipContractList(accountId)
    if (response && !isNil(response.activeContracts)) {
      setActiveMentorships(map(response.activeContracts, (c, i) => ({ ...c, key: i })))
    }
  }

  useEffect(() => {
    getOngoingMentorshipContracts()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const viewMentorshipContract = id => {
    const path = `/student/dashboard/mentorship/contract/${id}`
    history.push(path)
  }

  const calculateOverallProgress = buckets => {
    let numCompleted = 0
    let totalTasks = 0
    map(buckets, bucket => {
      totalTasks += size(bucket.Tasks)
      map(bucket.Tasks, taskItem => {
        if (taskItem.progress === TASK_PROGRESS.COMPLETED) {
          numCompleted += 1
        }
      })
    })
    if (numCompleted === 0) {
      return 0
    }
    return ((numCompleted / totalTasks) * 100).toFixed(0)
  }

  const OngoingMentorships = () => {
    if (isEmpty(activeMentorships)) {
      return (
        <div className="col-12 mt-4">
          <Empty />
        </div>
      )
    }
    return map(activeMentorships, (activeMentorship, i) => (
      <div
        role="button"
        tabIndex={0}
        className="card btn border-0 text-left w-100"
        onClick={() => viewMentorshipContract(activeMentorship.mentorshipContractId)}
        onKeyDown={event => event.preventDefault()}
        key={i}
      >
        <div className="card-body">
          <div className="row align-items-center">
            <div className="col-12">
              <h5 className="truncate-2-overflow text-wrap font-weight-bold">
                {activeMentorship.MentorshipListing.name}
              </h5>
              <span className="mb-2 h6 text-dark text-uppercase text-wrap">
                {getUserFullName(activeMentorship.MentorshipListing.Sensei)}
              </span>
              <div className="truncate-2-overflow text-wrap text-muted">
                {activeMentorship.MentorshipListing.description}
              </div>
              <div className="col-12 mt-1">
                <Progress
                  percent={calculateOverallProgress(activeMentorship.TaskBuckets)}
                  status="active"
                />
              </div>
              <div className="col-12 mt-1">
                <small className="text-uppercase text-secondary">
                  Created on {formatTime(activeMentorship.createdAt)}
                </small>
              </div>
            </div>
          </div>
        </div>
      </div>
    ))
  }

  return (
    <div>
      <div className="row mt-4">
        <div className="col-auto">
          <div className="text-dark h3">
            <strong>Ongoing Mentorships</strong>
          </div>
        </div>
      </div>
      <OngoingMentorships />
    </div>
  )
}

export default StudentMentorships

import { Empty, Progress } from 'antd'
import Avatar from 'antd/lib/avatar/avatar'
import { calculateOverallProgress, formatTime, getImage, getUserFullName } from 'components/utils'
import { isEmpty, isNil, map } from 'lodash'
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

  const OngoingMentorships = () => {
    if (isEmpty(activeMentorships)) {
      return (
        <div className="col-12 mt-4">
          <Empty />
        </div>
      )
    }
    return (
      <div className="col-12 col-md-6">
        {map(activeMentorships, (activeMentorship, i) => (
          <div
            role="button"
            tabIndex={0}
            className="card btn rounded-lg text-left w-100"
            onClick={() => viewMentorshipContract(activeMentorship.mentorshipContractId)}
            onKeyDown={event => event.preventDefault()}
            key={i}
          >
            <div className="card-body">
              <div className="row align-items-center">
                <div className="col-auto">
                  <Avatar
                    src={getImage('user', activeMentorship.MentorshipListing.Sensei)}
                    size={48}
                  />
                </div>
                <div className="col">
                  <span className="h5 m-0 truncate-2-overflow text-wrap font-weight-bold">
                    {activeMentorship.MentorshipListing.name}
                  </span>
                  <div className="text-wrap pt-1">
                    {`by ${getUserFullName(activeMentorship.MentorshipListing.Sensei)}`}
                  </div>
                </div>
              </div>
              <div className="row align-items-center mt-2">
                <div className="col-12">
                  <div className="text-2-lines truncate-2-overflow text-wrap text-muted">
                    {activeMentorship.MentorshipListing.description}
                  </div>
                  <div className="mt-2">
                    <Progress
                      percent={calculateOverallProgress(activeMentorship.TaskBuckets)}
                      status="active"
                    />
                  </div>
                  <div className="mt-2">
                    <small className="text-uppercase text-secondary">
                      Created on {formatTime(activeMentorship.createdAt)}
                    </small>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    )
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
      <div className="row mt-4">
        <OngoingMentorships />
      </div>
    </div>
  )
}

export default StudentMentorships

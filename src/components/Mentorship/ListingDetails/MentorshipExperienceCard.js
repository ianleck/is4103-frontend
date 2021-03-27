import React, { useEffect, useState } from 'react'
import { Empty } from 'antd'
import { useParams } from 'react-router-dom'

import moment from 'moment'
import { isNil } from 'lodash'
import { getMentorshipListing } from 'services/mentorship/listings'

const MentorshipExperienceCard = () => {
  const [experience, setExperience] = useState([])
  const { id } = useParams()
  let isExperienceEmpty = false
  if (!isNil(experience)) isExperienceEmpty = experience.length === 0

  useEffect(() => {
    const getListing = async () => {
      const listing = await getMentorshipListing(id)
      if (!listing) {
        setExperience([])
      } else {
        setExperience(listing.experience)
      }
    }
    getListing()
  }, [id])

  const sortExperienceByDate = experience.sort(
    (a, b) => new Date(b.dateStart).getTime() - new Date(a.dateStart).getTime(),
  )
  const UserExperiences = () => {
    return sortExperienceByDate.map(item => (
      <div className="card" key={item.experienceId}>
        <div className="card-body">
          <div className="row justify-content-between align-items-center text-dark">
            <div className="col-auto">
              <span>
                {moment(item.dateStart).format('DD MMM YYYY')}
                {' to '}
                {moment(item.dateEnd).format('DD MMM YYYY')}
              </span>
            </div>
          </div>
          <div className="row mt-2 text-dark align-items-center">
            <div className="col-12 mt-3 h5 font-weight-bold">
              <span>{item.role}</span>
            </div>
            <div className="col-12">
              <span>{item.description}</span>
            </div>
          </div>
        </div>
      </div>
    ))
  }

  return (
    <div className="card">
      <div className="card-header pb-1">
        <div className="row align-items-center justify-content-between mb-2">
          <div className="col-auto">
            <span className="h3 font-weight-bold text-dark">My Experience</span>
          </div>
        </div>
      </div>
      <div className="card-body">
        {isExperienceEmpty && <Empty />}
        {!isExperienceEmpty && <UserExperiences />}
      </div>
    </div>
  )
}

export default MentorshipExperienceCard

import { Avatar, Button, Empty, Space } from 'antd'
import { getUserFullName, sendToSocialProfile } from 'components/utils'
import { isEmpty, isNil, map } from 'lodash'
import React, { useState, useEffect } from 'react'
import { useSelector } from 'react-redux'
import { useHistory } from 'react-router-dom'
import { getTestimonialByFilter } from 'services/mentorship/testimonials'

const StudentTestimonials = () => {
  const user = useSelector(state => state.user)
  const history = useHistory()
  const { accountId } = user
  const [testimonials, setTestimonials] = useState([])

  const getTestimonials = async () => {
    const response = await getTestimonialByFilter({ accountId })

    if (response && !isNil(response.testimonials)) {
      setTestimonials(map(response.testimonials, (t, i) => ({ ...t, key: i })))
    }
  }

  useEffect(() => {
    getTestimonials()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const getSenseiDefaultProfilePic = sensei => {
    if (isNil(sensei.profileImgUrl)) {
      return '/resources/images/avatars/master.png'
    }
    return sensei.profileImgUrl
  }

  const sendToMentorshipListingPage = id => {
    const path = `/student/mentorship/view/${id}`
    history.push(path)
  }

  const sendToMentorshipContractPage = id => {
    const path = `/student/dashboard/mentorship/contract/${id}`
    history.push(path)
  }

  const displayTestimonials = () =>
    map(testimonials, testimonial => (
      <div className="card" key={testimonial.key}>
        <div className="card-header">
          <div className="text-dark h4">Testimonial</div>
          <div className="row ml-1 align-items-center">
            <div>
              <div
                role="button"
                tabIndex={0}
                className="btn border-0 w-100 p-0"
                onClick={() =>
                  sendToSocialProfile(
                    user,
                    history,
                    testimonial.MentorshipContract.MentorshipListing.accountId,
                  )
                }
                onKeyDown={event => event.preventDefault()}
              >
                <Space size="middle">
                  <Avatar
                    size={32}
                    src={getSenseiDefaultProfilePic(
                      testimonial.MentorshipContract.MentorshipListing.Sensei,
                    )}
                  />
                  <div className="text-muted h6">
                    {getUserFullName(testimonial.MentorshipContract.MentorshipListing.Sensei)}
                  </div>
                </Space>
              </div>
            </div>
          </div>
        </div>
        <div className="card-body">
          <div>{testimonial.body}</div>
        </div>
        <div className="card-footer">
          <div className="h6 text-muted">Mentorship Details: </div>
          <div className="h6 text-muted mb-0">
            {`Listing: `}
            <Button
              className="pl-0"
              type="link"
              onClick={() =>
                sendToMentorshipListingPage(
                  testimonial.MentorshipContract.MentorshipListing.mentorshipListingId,
                )
              }
            >
              {testimonial.MentorshipContract.MentorshipListing.name}
            </Button>
          </div>
          <div className="h6 text-muted mb-0">
            {`Contract: `}
            <Button
              className="pl-0"
              type="link"
              onClick={() =>
                sendToMentorshipContractPage(testimonial.MentorshipContract.mentorshipContractId)
              }
            >
              {testimonial.MentorshipContract.mentorshipContractId}
            </Button>
          </div>
        </div>
      </div>
    ))

  return isEmpty(testimonials) ? <Empty /> : displayTestimonials()
}

export default StudentTestimonials

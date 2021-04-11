import { Avatar, Button, Form, Input } from 'antd'
import ProductCard from 'components/Cart/ProductCard'
import BackBtn from 'components/Common/BackBtn'
import { getUserFullName, onFinishFailed, showNotification } from 'components/utils'
import { DEFAULT_TIMEOUT } from 'constants/constants'
import {
  ERROR,
  SUCCESS,
  TESTIMONIAL_ADD_ERR,
  TESTIMONIAL_ADD_SUCCESS,
} from 'constants/notifications'
import { isNil } from 'lodash'
import React, { useEffect, useState } from 'react'
import { useHistory, useParams } from 'react-router-dom'
import { getMentorshipListing } from 'services/mentorship/listings'
import { createTestimonial } from 'services/mentorship/testimonials'
import { getProfile } from 'services/user'

const CreateTestimonial = () => {
  const { accountId, mentorshipListingId } = useParams()
  const history = useHistory()
  const [testimonialForm] = Form.useForm()
  const [mentorshipListing, setMentorshipListing] = useState('')
  const [mentee, setMentee] = useState('')

  const getListing = async () => {
    const response = await getMentorshipListing(mentorshipListingId)

    if (response && !isNil(response.mentorshipListing)) {
      setMentorshipListing(response.mentorshipListing)
    }
  }

  const getStudentProfile = async () => {
    const response = await getProfile(accountId)
    if (response) {
      setMentee(response)
    }
  }

  useEffect(() => {
    getListing()
    getStudentProfile()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const onSubmit = async values => {
    const payload = { accountId, mentorshipListingId, testimonial: values.testimonial }
    const response = await createTestimonial(payload)

    if (response && !isNil(response.createdTestimonial)) {
      showNotification('success', SUCCESS, TESTIMONIAL_ADD_SUCCESS)
      setTimeout(() => {
        history.goBack()
      }, DEFAULT_TIMEOUT)
    } else {
      showNotification('error', ERROR, TESTIMONIAL_ADD_ERR)
    }
  }

  const getDefaultProfilePic = () => {
    return '/resources/images/avatars/apprentice.png'
  }

  const StudentProfileCard = ({ imgSrc, fullName, username, emailAddress }) => {
    return (
      <div className="row align-items-center">
        <div className="col-auto pl-2">
          <Avatar size={64} src={imgSrc} />
        </div>
        <div className="col pl-2">
          <h5 className="truncate-2-overflow text-wrap font-weight-bold">{fullName}</h5>
          <span className="mb-2 h6 text-dark text-uppercase text-wrap">{username}</span>
          <div className="truncate-2-overflow text-wrap text-muted">{emailAddress}</div>
        </div>
      </div>
    )
  }
  return (
    <div>
      <div className="row">
        <div className="col-12 col-md-3 col-lg-2 mt-4 mt-md-0">
          <BackBtn />
        </div>
      </div>
      <div className="row mt-4">
        <div className="col-12">
          <div className="card">
            <div className="card-header pb-1">
              <div className="h3 font-weight-bold text-dark">Testimonial Form</div>
            </div>
            <div className="card-body">
              <div className="row align-items-center">
                <div className="col-6">
                  <ProductCard
                    location="CreateTestimonialPage"
                    listing={mentorshipListing}
                    key={mentorshipListing.mentorshipListingId}
                    isTestimonial
                  />
                </div>
                <div className="col-6 mt-4">
                  <StudentProfileCard
                    imgSrc={mentee.profileImgUrl ? mentee.profileImgUrl : getDefaultProfilePic()}
                    fullName={getUserFullName(mentee)}
                    username={mentee.username}
                    emailAddress={mentee.email}
                  />
                </div>
              </div>
              <div className="row mt-4">
                <div className="col-12">
                  <Form
                    form={testimonialForm}
                    layout="vertical"
                    id="testimonialForm"
                    onSubmit={e => e.preventDefault()}
                    onFinish={onSubmit}
                    onFinishFailed={onFinishFailed}
                  >
                    <Form.Item name="testimonial">
                      <Input.TextArea
                        rows={5}
                        placeholder="Describe the student's character and share the qualifications and skills of the student."
                      />
                    </Form.Item>
                    <div className="row justify-content-center mt-4">
                      <Button type="primary" form="testimonialForm" htmlType="submit">
                        Submit
                      </Button>
                    </div>
                  </Form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CreateTestimonial

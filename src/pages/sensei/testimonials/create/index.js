import { Avatar, Button, Form, Input } from 'antd'
import ProductCard from 'components/Common/ProductCard'
import BackBtn from 'components/Common/BackBtn'
import { getUserFullName, onFinishFailed, showNotification } from 'components/utils'
import { DEFAULT_TIMEOUT } from 'constants/constants'
import {
  ERROR,
  SUCCESS,
  TESTIMONIAL_ADD_ERR,
  TESTIMONIAL_ADD_SUCCESS,
  TESTIMONIAL_EDIT_ERR,
  TESTIMONIAL_EDIT_SUCCESS,
} from 'constants/notifications'
import { isNil, size } from 'lodash'
import React, { useEffect, useState } from 'react'
import { useHistory, useParams } from 'react-router-dom'
import {
  createTestimonial,
  editTestimonial,
  getTestimonialByFilter,
} from 'services/mentorship/testimonials'
import { getProfile } from 'services/user'
import { getSubscription } from 'services/mentorship/subscription'

const CreateTestimonial = () => {
  const { accountId, mentorshipContractId } = useParams()
  const history = useHistory()
  const [testimonialForm] = Form.useForm()
  const [mentorshipListing, setMentorshipListing] = useState('')
  const [currentTestimonial, setCurrentTestimonial] = useState([])
  const [isEditMode, setIsEditMode] = useState(false)
  const [isDirty, setIsDirty] = useState(false)
  const [mentee, setMentee] = useState('')

  const getTestimonial = async () => {
    const response = await getTestimonialByFilter({ mentorshipContractId, accountId })

    if (response && !isNil(response.testimonials) && size(response.testimonials) === 1) {
      setCurrentTestimonial(response.testimonials[0])
      testimonialForm.setFieldsValue({ testimonialBody: response.testimonials[0].body })
      setIsEditMode(true)
    }
  }

  const getMentorshipContract = async () => {
    const response = await getSubscription(mentorshipContractId)
    if (response && !isNil(response.contract)) {
      if (!isNil(response.contract.MentorshipListing))
        setMentorshipListing(response.contract.MentorshipListing)
    }
  }

  const getStudentProfile = async () => {
    const response = await getProfile(accountId)
    if (response) {
      setMentee(response)
    }
  }

  useEffect(() => {
    getTestimonial()
    getMentorshipContract()
    getStudentProfile()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const onSubmit = async values => {
    if (!isEditMode) {
      const payload = { accountId, mentorshipContractId, testimonial: values.testimonialBody }
      const response = await createTestimonial(payload)

      if (response && !isNil(response.createdTestimonial)) {
        showNotification('success', SUCCESS, TESTIMONIAL_ADD_SUCCESS)
        setTimeout(() => {
          history.goBack()
        }, DEFAULT_TIMEOUT)
      } else {
        showNotification('error', ERROR, TESTIMONIAL_ADD_ERR)
      }
    } else {
      const payload = {
        testimonialId: currentTestimonial.testimonialId,
        testimonial: values.testimonialBody,
      }
      const response = await editTestimonial(payload)
      if (response) {
        showNotification('success', SUCCESS, TESTIMONIAL_EDIT_SUCCESS)
        setIsDirty(false)
        setTimeout(() => {
          history.goBack()
        }, DEFAULT_TIMEOUT)
      } else {
        showNotification('error', ERROR, TESTIMONIAL_EDIT_ERR)
      }
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
                <div className="col-12 col-md-6">
                  <ProductCard
                    location="CreateTestimonialPage"
                    listing={mentorshipListing}
                    key={mentorshipListing.mentorshipListingId}
                    isTestimonial
                  />
                </div>
                <div className="col-12 col-md-6 mt-4">
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
                    onFieldsChange={() => setIsDirty(true)}
                  >
                    <Form.Item name="testimonialBody">
                      <Input.TextArea
                        rows={5}
                        placeholder="Describe the student's character and share the qualifications and skills of the student."
                      />
                    </Form.Item>
                    <div className="row justify-content-center mt-4">
                      <Button
                        type="primary"
                        size="large"
                        form="testimonialForm"
                        htmlType="submit"
                        disabled={!isDirty}
                      >
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

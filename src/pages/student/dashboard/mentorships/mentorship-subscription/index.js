import { UserOutlined } from '@ant-design/icons'
import { Descriptions } from 'antd'
import Avatar from 'antd/lib/avatar/avatar'
import BackBtn from 'components/Common/BackBtn'
import TaskComponent from 'components/Mentorship/Subscription/Task'
import { isNil } from 'lodash'
import React, { useEffect, useState } from 'react'
import { Helmet } from 'react-helmet'
import { useParams } from 'react-router-dom'
import { getSubscription } from 'services/mentorship/subscription'

const MentorshipSubscriptionView = () => {
  const { id } = useParams()
  const [mentorshipSubscription, setMentorshipSubscription] = useState([])
  const [mentorshipListing, setMentorshipListing] = useState([])

  useEffect(() => {
    const getMentorshipSubscription = async () => {
      const result = await getSubscription(id)

      if (result && !isNil(result.contract)) {
        setMentorshipSubscription(result.contract)
        if (!isNil(result.contract.MentorshipListing)) {
          setMentorshipListing(result.contract.MentorshipListing)
        }
      }
    }

    getMentorshipSubscription()
  }, [id])

  console.log('mentorshipSubscription is ', mentorshipSubscription) // Nat to deal with this in a later PR to populate the page with more subscription specific deets

  return (
    <div>
      <Helmet title="Mentorship Subscription" />
      <div>
        <Helmet title="View Mentorship Subscription" />
        <div className="row pt-2 justify-content-between">
          <div className="col-12 col-md-3 col-lg-2 mt-4 mt-md-0">
            <BackBtn />
          </div>
        </div>
        <div className="row mt-4">
          <div className="col-12 col-md-2 d-flex align-items-center justify-content-center">
            {/* substitute the following lines with equivalent of MentorshipProfilePicture */}
            <Avatar
              size={104}
              icon={<UserOutlined />}
              src={
                mentorshipListing.Sensei?.profileImgUrl
                  ? mentorshipListing.Sensei?.profileImgUrl
                  : '/resources/images/avatars/avatar-2.png'
              }
            />
          </div>
          {/* substitute the following lines with equivalent of MentorshipDescriptionCard */}
          <div className="col-12 col-md-5 my-2 d-flex align-items-stretch">
            <div className="card">
              <div className="card-body">
                <div className="row justify-content-between">
                  <div className="col-12 text-left mt-2">
                    <Descriptions title="Mentorship Description">
                      <p>{mentorshipListing.description}</p>
                    </Descriptions>
                  </div>
                </div>
              </div>
            </div>
          </div>
          {/* substitute the following lines with equivalent of MentorshipPricingCard */}
          <div className="col-12 col-md-5 my-2 d-flex align-items-stretch">
            <div className="card">
              <div className="card-body">
                <div className="col-12 text-left mt-2">
                  <Descriptions title="Pass Price">
                    <div>${parseFloat(mentorshipListing.priceAmount).toFixed(2)}</div>
                  </Descriptions>
                </div>
              </div>
            </div>
          </div>
          <div className="col-12">
            <TaskComponent />
          </div>
        </div>
      </div>
    </div>
  )
}

export default MentorshipSubscriptionView

import React, { useState, useEffect } from 'react'
import { Button, Form, Input, Modal } from 'antd'
import { useParams, useHistory } from 'react-router-dom'
import {
  createMentorshipApplication,
  updateMentorshipApplication,
} from 'services/mentorship/applications'
import BackBtn from 'components/Common/BackBtn'
import PageHeader from 'components/Common/PageHeader'
import { isEmpty, isNil, keys, map, trim } from 'lodash'
import { getMentorshipListing } from 'services/mentorship/listings'
import { onFinishFailed, showNotification } from 'components/utils'
import { MTS_APP_SUB_SUCCESS, MTS_APP_UPDATE_SUCCESS, SUCCESS } from 'constants/notifications'
import { CLOSE } from 'constants/text'
import { EyeOutlined } from '@ant-design/icons'
import MentorshipInfo from 'components/Mentorship/MentorshipInfo'

const ApplyListingForm = () => {
  const { TextArea } = Input

  const { id } = useParams()
  const [mentorshipAppForm] = Form.useForm()

  const history = useHistory()

  const [listing, setListing] = useState('')
  const [contract, setContract] = useState('')
  const [showMentorshipModal, setShowMentorshipModal] = useState(false)

  const getListing = async () => {
    const response = await getMentorshipListing(id)
    if (response && !isNil(response.mentorshipListing)) {
      setListing(response.mentorshipListing)
    }
    if (!isNil(response.existingContract && !isEmpty(response.existingContract))) {
      setContract(response.existingContract)
      if (!isNil(response.existingContract.applicationFields)) {
        const currentContract = response.existingContract.applicationFields
        mentorshipAppForm.setFieldsValue({
          applicationReason: currentContract.applicationReason,
          stepsTaken: currentContract.stepsTaken,
          idealDuration: currentContract.idealDuration,
          goals: currentContract.goals,
          additionalInfo: currentContract.additionalInfo,
        })
      }
    }
  }

  useEffect(() => {
    getListing()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const onSubmit = async values => {
    map(keys(values), key => {
      values[key] = trim(values[key])
    })
    const formValues = {
      applicationFields: {
        ...(values.applicationReason && { applicationReason: values.applicationReason }),
        ...(values.goals && { goals: values.goals }),
        ...(values.stepsTaken && { stepsTaken: values.stepsTaken }),
        ...(values.idealDuration && { idealDuration: values.idealDuration }),
        ...(values.additionalInfo && { additionalInfo: values.additionalInfo }),
      },
    }
    if (!isEmpty(contract) && !isNil(contract.mentorshipContractId)) {
      const response = await updateMentorshipApplication(contract.mentorshipContractId, formValues)
      if (response && response.success) {
        showNotification('success', SUCCESS, MTS_APP_UPDATE_SUCCESS)
      }
      history.goBack()
    } else if (!isNil(id)) {
      const response = await createMentorshipApplication(id, formValues)
      if (response && response.success) {
        showNotification('success', SUCCESS, MTS_APP_SUB_SUCCESS)
      }
      history.goBack()
    }
  }

  return (
    <div>
      <div className="row pt-2">
        <div className="col-12 col-md-3 col-lg-2 mt-4 mt-md-0">
          <BackBtn />
        </div>
      </div>
      <PageHeader type="mentorship" listing={listing}>
        <div className="col-12 col-sm-auto col-lg-auto ml-lg-auto mt-4 mt-lg-0">
          <Button
            key="showDetailsModal"
            type="default"
            size="large"
            icon={<EyeOutlined />}
            onClick={() => setShowMentorshipModal(true)}
          >
            Quick View
          </Button>
        </div>
        <div className="col-auto col-sm-auto col-lg-auto pl-sm-2 mt-4 mt-lg-0">
          <Button type="primary" size="large" htmlType="submit" form="mentorshipAppForm">
            {!isNil(contract.mentorshipContractId) ? 'Update Application' : 'Submit Application'}
          </Button>
        </div>
      </PageHeader>
      <div className="row mt-4">
        <div className="col-12">
          <div className="card">
            <div className="card-header pb-1">
              <div className="h3 font-weight-bold text-dark">Mentorship Application Form</div>
            </div>
            <div className="card-body">
              <div className="row">
                <div className="col-12">
                  <Form
                    form={mentorshipAppForm}
                    id="mentorshipAppForm"
                    layout="vertical"
                    hideRequiredMark
                    onSubmit={e => e.preventDefault()}
                    onFinish={onSubmit}
                    onFinishFailed={onFinishFailed}
                  >
                    <Form.Item
                      name="applicationReason"
                      label="Application Reason"
                      rules={[
                        { required: true, message: 'Your application reason cannot be empty.' },
                      ]}
                    >
                      <TextArea
                        rows={5}
                        placeholder="Why do you want to apply for this mentorship?"
                      />
                    </Form.Item>
                    <Form.Item
                      name="goals"
                      label="Goals"
                      rules={[{ required: true, message: 'Your goals cannot be empty.' }]}
                    >
                      <TextArea
                        rows={3}
                        placeholder="What are your projected goals for this mentorship?"
                      />
                    </Form.Item>
                    <Form.Item name="stepsTaken" label="Steps Taken (Optional)">
                      <TextArea
                        rows={3}
                        placeholder="Have you done anything related to your mentorship leading up to now?"
                      />
                    </Form.Item>
                    <Form.Item name="idealDuration" label="Ideal Duration (Optional)">
                      <TextArea
                        rows={3}
                        placeholder="Please indicate your ideal duration for this mentorship?"
                      />
                    </Form.Item>
                    <Form.Item name="additionalInfo" label="Additional Info (Optional)">
                      <TextArea
                        rows={3}
                        placeholder="Please include any additional remarks you wish to let your mentor know about."
                      />
                    </Form.Item>
                  </Form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Modal
        title="Quick View"
        centered
        className="w-75"
        bodyStyle={{ maxHeight: '65vh', overflowY: 'scroll' }}
        visible={showMentorshipModal}
        cancelText={CLOSE}
        onCancel={() => setShowMentorshipModal(false)}
        okButtonProps={{ style: { display: 'none' } }}
      >
        <MentorshipInfo listing={listing} />
      </Modal>
    </div>
  )
}

export default ApplyListingForm

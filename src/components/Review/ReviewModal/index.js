import { Button, Form, Modal, Rate } from 'antd'
import TextArea from 'antd/lib/input/TextArea'
import { onFinishFailed } from 'components/utils'
import { isEmpty } from 'lodash'
import React, { useEffect } from 'react'

const ReviewModal = ({ isVisible, setShowReviewModal, review, editMode, onSubmitReview }) => {
  const [reviewForm] = Form.useForm()

  useEffect(() => {
    const reviewExists = !isEmpty(review)
    if (reviewExists) {
      reviewForm.setFieldsValue({
        rating: review[0].rating,
        comment: review[0].comment,
      })
    }
  }, [review, reviewForm])

  const getAction = () => {
    if (editMode) {
      return 'Edit'
    }
    return 'Add'
  }

  const reviewFooter = (
    <div className="row justify-content-between">
      <div className="col-auto">
        <Button type="default" size="large" onClick={() => setShowReviewModal(false)}>
          Close
        </Button>
      </div>
      <div className="col-auto">
        <Button type="primary" form="reviewForm" htmlType="submit" size="large">
          {getAction()}
        </Button>
      </div>
    </div>
  )
  return (
    <Modal
      visible={isVisible}
      title={`${getAction()} a Review`}
      cancelText="Close"
      centered
      okButtonProps={{ style: { display: 'none' } }}
      onCancel={() => setShowReviewModal(false)}
      footer={reviewFooter}
      getContainer={false}
    >
      <Form
        id="reviewForm"
        form={reviewForm}
        layout="vertical"
        hideRequiredMark
        onSubmit={e => e.preventDefault()}
        onFinish={onSubmitReview}
        onFinishFailed={onFinishFailed}
      >
        <Form.Item label="Rating" name="rating">
          <Rate defaultValue={5} />
        </Form.Item>

        <Form.Item label="Review Comment" name="comment">
          <TextArea
            placeholder="Tell us more about your experience."
            autoSize={{ minRows: 2, maxRows: 6 }}
          />
        </Form.Item>
      </Form>
    </Modal>
  )
}

export default ReviewModal

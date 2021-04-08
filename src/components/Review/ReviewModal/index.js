import { Button, Form, Modal, Rate } from 'antd'
import TextArea from 'antd/lib/input/TextArea'
import { onFinishFailed } from 'components/utils'
import React from 'react'
import { useParams } from 'react-router-dom'
import { addCourseReview } from 'services/review'

const ReviewModal = ({ isVisible, setShowReviewModal, isCourse }) => {
  const { id } = useParams()
  const [addReviewForm] = Form.useForm()

  const onAddReview = values => {
    const formValues = {
      rating: values.rating,
      comment: values.comment,
    }
    console.log('formValues', formValues)
    console.log('isCourse', isCourse)

    if (isCourse) {
      const payload = { courseId: id, review: { ...formValues } }
      addCourseReview(payload)
    }
    setShowReviewModal(false)
  }

  const addReviewFooter = (
    <div className="row justify-content-between">
      <div className="col-auto">
        <Button type="default" size="large" onClick={() => setShowReviewModal(false)} className="">
          Close
        </Button>
      </div>
      <div className="col-auto">
        <Button type="primary" form="addReviewForm" htmlType="submit" size="large" className="">
          Add
        </Button>
      </div>
    </div>
  )
  return (
    <Modal
      visible={isVisible}
      title="Add a Review"
      cancelText="Close"
      centered
      okButtonProps={{ style: { display: 'none' } }}
      onCancel={() => setShowReviewModal(false)}
      footer={addReviewFooter}
    >
      <Form
        id="addReviewForm"
        form={addReviewForm}
        layout="vertical"
        hideRequiredMark
        onSubmit={e => e.preventDefault()}
        onFinish={onAddReview}
        onFinishFailed={onFinishFailed}
      >
        <Form.Item label="Rating" name="rating">
          <Rate />
        </Form.Item>

        <Form.Item label="Review Comment" name="comment">
          <TextArea
            placeholder="Tell us more about what your experience."
            autoSize={{ minRows: 2, maxRows: 6 }}
          />
        </Form.Item>
      </Form>
    </Modal>
  )
}

export default ReviewModal

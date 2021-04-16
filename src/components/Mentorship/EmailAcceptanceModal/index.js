import { Button, Form, Input, Modal } from 'antd'
import TextArea from 'antd/lib/input/TextArea'
import { onFinishFailed } from 'components/utils'
import React from 'react'

const EmailAcceptanceModal = ({ isVisible, onSubmitEmailParams, setShowEmailParamsModal }) => {
  const [emailAcceptanceForm] = Form.useForm()

  const emailAcceptanceFooter = (
    <div className="row justify-content-between">
      <div className="col-auto">
        <Button type="default" size="large" onClick={() => setShowEmailParamsModal(false)}>
          Close
        </Button>
      </div>
      <div className="col-auto">
        <Button type="primary" form="emailAcceptanceForm" htmlType="submit" size="large">
          Approve
        </Button>
      </div>
    </div>
  )
  return (
    <Modal
      visible={isVisible}
      title="Email confirmation details of application acceptance"
      cancelText="Close"
      centered
      okButtonProps={{ style: { display: 'none' } }}
      onCancel={() => setShowEmailParamsModal(false)}
      footer={emailAcceptanceFooter}
      getContainer={false}
    >
      <Form
        id="emailAcceptanceForm"
        form={emailAcceptanceForm}
        layout="vertical"
        hideRequiredMark
        onSubmit={e => e.preventDefault()}
        onFinish={onSubmitEmailParams}
        onFinishFailed={onFinishFailed}
      >
        <Form.Item
          name="numSlots"
          label="Recommended number of slots for this mentorship"
          rules={[{ required: true, message: 'Please input a valid number' }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          name="duration"
          label="Recommended duration of mentorship"
          rules={[{ required: true, message: 'Please input a valid duration' }]}
        >
          <Input placeholder="E.g 2 months, 3 weeks" />
        </Form.Item>
        <Form.Item
          label="Message for the student"
          name="message"
          rules={[{ required: true, message: 'Please write a message.' }]}
        >
          <TextArea
            placeholder="Give tips on how to prepare for the first consultation, and set the stage on what to expect."
            autoSize={{ minRows: 2, maxRows: 6 }}
          />
        </Form.Item>
      </Form>
    </Modal>
  )
}

export default EmailAcceptanceModal

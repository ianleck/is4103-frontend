import { Avatar, Button, Modal, Skeleton } from 'antd'
import React from 'react'

const AllReviewsModal = ({ showAllReviewsModal, setShowAllReviewsModal, isLoading }) => {
  const allReviewsFooter = (
    <div className="row">
      <div className="col-auto">
        <Button
          type="default"
          size="large"
          onClick={() => setShowAllReviewsModal(false)}
          className=""
        >
          Close
        </Button>
      </div>
    </div>
  )

  return (
    <Modal
      title="Course Reviews"
      visible={showAllReviewsModal}
      cancelText="Close"
      centered
      okButtonProps={{ style: { display: 'none' } }}
      onCancel={() => setShowAllReviewsModal(false)}
      footer={allReviewsFooter}
    >
      <div className="row">
        <div className="col-12">
          <div className="row">
            <div className="col-auto">
              <Avatar src="/resources/images/avatars/avatar-2.png" />
            </div>
            <div className="col">
              <div className="row text-dark">
                <div className="col-12">
                  <span className="h5 font-weight-bold">Tester</span>
                  <span className="text-muted">&nbsp;&nbsp;Test</span>
                </div>
                <div className="col-12">
                  <Skeleton active loading={isLoading} paragraph={false}>
                    <span>Heyyy</span>
                  </Skeleton>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Modal>
  )
}

export default AllReviewsModal

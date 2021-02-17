import React, { useState } from 'react'
import { connect } from 'react-redux'
import { Modal } from 'antd'
import style from './style.module.scss'

const mapStateToProps = ({ user }) => ({
  userData: {
    firstName: user.firstName,
    lastName: user.lastName,
    username: user.username,
    emailVerified: user.emailVerified,
    email: user.email,
    contactNumber: user.contactNumber,
    status: user.status,
  },
})

const StudentProfileCard = ({ userData }) => {
  const [showEditProfile, setShowEditProfile] = useState(false)

  return (
    <div className="d-flex flex-wrap flex-column align-items-center">
      <div className="kit__utils__avatar kit__utils__avatar--size64 mb-3">
        <img src="../resources/images/avatars/5.jpg" alt="Mary Stanform" />
      </div>
      <div className="text-center">
        <div className="text-dark font-weight-bold font-size-18">{`${userData.firstName} ${userData.lastName}`}</div>
        <div className="text-uppercase font-size-12 mb-3">Support team</div>
        <button
          type="button"
          className={`btn btn-primary ${style.btnWithAddon}`}
          onClick={() => setShowEditProfile(true)}
        >
          <span className={`${style.btnAddon}`}>
            <i className={`${style.btnAddonIcon} fe fe-edit`} />
          </span>
          Edit Profile
        </button>
        <button type="button" className="btn btn-outline-primary ml-2">
          <span className={`${style.btnAddon}`}>
            <i className={`${style.btnAddonIcon} fe fe-share-2`} />
          </span>
        </button>
      </div>
      <Modal
        title="Basic Modal"
        visible={showEditProfile}
        onOk={() => setShowEditProfile(false)}
        onCancel={() => setShowEditProfile(false)}
        width="100%"
      >
        <p>Some contents...</p>
        <p>Some contents...</p>
        <p>Some contents...</p>
      </Modal>
    </div>
  )
}

export default connect(mapStateToProps)(StudentProfileCard)

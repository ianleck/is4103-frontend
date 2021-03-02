import React from 'react'
import { useHistory } from 'react-router-dom'
import { Helmet } from 'react-helmet'
import { Button } from 'antd'
import { ArrowLeftOutlined } from '@ant-design/icons'
import NewMentorTable from '../../../components/Admin/VerifySensei/NewSenseiTable'
import UnverifiedWidget from '../../../components/Admin/VerifySensei/UnverifiedWidget'
import VerifiedWidget from '../../../components/Admin/VerifySensei/VerifiedWidget'
import TotalSenseiWidget from '../../../components/Admin/VerifySensei/TotalSenseiWidget'

// const { TabPane } = Tabs
// const mapStateToProps = ({ user }) => ({ user })

const VerifyMentors = () => {
  const history = useHistory()

  const onBack = e => {
    e.preventDefault()
    const path = '/admin/user-management/'
    history.push(path)
  }

  return (
    <div>
      <div className="row">
        <Helmet title="User Management" />
        <div className="col-auto">
          <div className="text-dark text-uppercase h3">
            <strong>Verify Senseis</strong>
          </div>
        </div>
      </div>

      <div className="row mt-4">
        <div className="col-12 col-md-3 col-lg-2 mt-4 mt-md-0">
          <Button
            block
            type="primary"
            size="large"
            shape="round"
            onClick={onBack}
            icon={<ArrowLeftOutlined />}
          >
            Back
          </Button>
        </div>
      </div>

      <div className="row mt-4">
        <div className="col-xl-4 col-lg-12">
          <UnverifiedWidget />
        </div>

        <div className="col-xl-4 col-lg-12">
          <VerifiedWidget />
        </div>

        <div className="col-xl-4 col-lg-12">
          <TotalSenseiWidget />
        </div>

        <div className="col-xl-12 col-lg-12">
          <NewMentorTable />
        </div>
      </div>
    </div>
  )
}

export default VerifyMentors

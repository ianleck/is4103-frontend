import React from 'react'
import { useHistory } from 'react-router-dom'
import { Helmet } from 'react-helmet'
import { Button } from 'antd'
import { ArrowLeftOutlined } from '@ant-design/icons'
import NewMentorTable from '../../../components/Admin/VerifyMentors/NewMentorTable'
import UnverifiedWidget from '../../../components/Admin/VerifyMentors/UnverifiedWidget'
import VerifiedWidget from '../../../components/Admin/VerifyMentors/VerifiedWidget'
import TotalSenseiWidget from '../../../components/Admin/VerifyMentors/TotalSenseiWidget'

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
      <Helmet title="Verify new Mentor" />
      <div className="cui__utils__heading">
        <strong>Verify Senseis</strong>
      </div>

      <div className="row">
        <div className="col-xl-12 col-lg-12">
          <div className="col-xl-2 col-lg-12">
            <div className="card">
              <Button type="primary" shape="round" onClick={onBack} icon={<ArrowLeftOutlined />}>
                Back
              </Button>
            </div>
          </div>
        </div>

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

import React from 'react'
import { useHistory } from 'react-router-dom'
import { Helmet } from 'react-helmet'
import { Button } from 'antd'
import { UserAddOutlined } from '@ant-design/icons'
import NewMentorTable from '../../../components/Admin/VerifyMentors/NewMentorTable'
import UnverifiedWidget from '../../../components/Admin/VerifyMentors/UnverifiedWidget'
import VerifiedWidget from '../../../components/Admin/VerifyMentors/VerifiedWidget'
import TotalSenseiWidget from '../../../components/Admin/VerifyMentors/TotalSenseiWidget'

// const { TabPane } = Tabs
// const mapStateToProps = ({ user }) => ({ user })

const VerifyMentors = () => {
  const history = useHistory()

  const getMentor = e => {
    e.preventDefault()
    const path = '/admin/user-management/verify-mentors/1'
    history.push(path)
  }

  return (
    <div>
      <Helmet title="Verify new Mentor" />
      <div className="cui__utils__heading">
        <strong>Verify Mentors</strong>
      </div>

      <div className="row">
        <div className="col-xl-12 col-lg-12">
          <div className="col-xl-3 col-lg-12" style={{ float: 'right' }}>
            <div className="card">
              <Button type="primary" shape="round" onClick={getMentor} icon={<UserAddOutlined />}>
                Verify mentor 1
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

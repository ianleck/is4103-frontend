import { FormOutlined } from '@ant-design/icons'
import { Button, Table } from 'antd'
import Paragraph from 'antd/lib/typography/Paragraph'
import { TESTIMONIALS, TESTIMONIAL_MGT } from 'constants/text'
import { isNil, map } from 'lodash'
import React, { useEffect, useState } from 'react'
import { Helmet } from 'react-helmet'
import { useSelector } from 'react-redux'
import { useHistory } from 'react-router-dom'
import { getSenseiTestimonials } from 'services/mentorship/testimonials'

const TestimonialManagement = () => {
  const history = useHistory()
  const user = useSelector(state => state.user)
  const { accountId } = user
  const [testimonials, setTestimonials] = useState([])
  const getTestimonials = async () => {
    const response = await getSenseiTestimonials(accountId)
    if (response && !isNil(response.testimonials)) {
      setTestimonials(map(response.testimonials, (t, i) => ({ ...t, key: i })))
    }
  }

  useEffect(() => {
    getTestimonials()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const viewTestimonialForm = record => {
    const path = `/sensei/testimonial/${record.MentorshipContract.mentorshipContractId}/${record.Student.accountId}`
    history.push(path)
  }

  const tableColumns = [
    {
      title: 'Testimonial Id',
      key: 'testimonialId',
      dataIndex: 'testimonialId',
      width: '15%',
    },
    {
      title: 'Student Id',
      key: ['Student', 'accountId'],
      dataIndex: 'accountId',
      width: '15%',
      responsive: ['lg'],
    },
    {
      title: 'Mentorship Contract Id',
      key: ['Mentorship Contract', 'mentorshipContractId'],
      dataIndex: 'mentorshipContractId',
      width: '15%',
      responsive: ['lg'],
    },
    {
      title: 'Testimonial Body',
      key: 'testimonialBody',
      dataIndex: 'body',
      render: record => {
        return (
          <Paragraph ellipsis={{ rows: 2, expandable: true, symbol: 'More' }}> {record} </Paragraph>
        )
      },
    },
    {
      title: 'Action',
      key: 'action',
      width: '10%',
      render: record => (
        <Button
          type="default"
          shape="circle"
          size="large"
          icon={<FormOutlined />}
          onClick={() => viewTestimonialForm(record)}
        />
      ),
    },
  ]
  return (
    <div>
      <div className="row">
        <Helmet title={TESTIMONIAL_MGT} />
        <div className="col-auto">
          <div className="text-dark text-uppercase h3">
            <strong>{TESTIMONIAL_MGT}</strong>
          </div>
        </div>
      </div>

      <div className="row mt-4">
        <div className="col-12">
          <div className="card">
            <div className="card-header card-header-flex">
              <div className="d-flex flex-column justify-content-center mr-auto">
                <h5>List of {TESTIMONIALS}</h5>
              </div>
            </div>

            <div className="card-body">
              <div className="row">
                <div className="col-12 overflow-x-scroll">
                  <Table dataSource={testimonials} columns={tableColumns} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default TestimonialManagement

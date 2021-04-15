import StudentConsultationComponent from 'components/Student/Consultation'
import React from 'react'
import { Helmet } from 'react-helmet'

const StudentConsultations = () => {
  return (
    <div>
      <Helmet title="Student Consultation" />

      <div>
        <StudentConsultationComponent />
      </div>
    </div>
  )
}

export default StudentConsultations

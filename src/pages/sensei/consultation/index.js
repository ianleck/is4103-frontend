import SenseiConsultationComponent from 'components/Sensei/Consultation'
import React from 'react'
import { Helmet } from 'react-helmet'

const SenseiConsultation = () => {
  return (
    <div>
      <Helmet title="Sensei Consultation" />

      <div>
        <SenseiConsultationComponent />
      </div>
    </div>
  )
}

export default SenseiConsultation

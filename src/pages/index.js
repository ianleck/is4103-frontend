import React from 'react'
import Logo from 'components/Common/LandingPage/Logo'
import WhatWeOffer from 'components/Common/LandingPage/WhatWeOffer'
import MentorshipProcess from 'components/Common/LandingPage/MentorshipProcess'
import Footer from 'components/Common/LandingPage/Footer'
import 'components/Common/LandingPage/less/antMotionStyle.less'

const LandingPage = () => {
  return (
    <div>
      <Logo />
      <WhatWeOffer />
      <MentorshipProcess />
      <Footer />
    </div>
  )
}

export default LandingPage

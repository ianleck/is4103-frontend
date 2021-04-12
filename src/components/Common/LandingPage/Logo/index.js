import React from 'react'
import TweenOne from 'rc-tween-one'
import QueueAnim from 'rc-queue-anim'
import ScrollParallax from 'rc-scroll-anim/lib/ScrollParallax'
import LandingLogoImage from 'components/Common/LandingPage/Logo/LandingLogoImage'
import FeaturedMentors from 'components/Common/LandingPage/FeaturedMentors'

const Logo = () => {
  const loop = {
    duration: 3000,
    yoyo: true,
    repeat: -1,
  }

  return (
    <div className="home-page-wrapper landinglogo-wrapper" id="landinglogo">
      <div className="landinglogo-bg-wrapper">
        <svg width="400px" height="576px" viewBox="0 0 400 576" fill="none">
          <TweenOne
            component="g"
            animation={[
              { opacity: 0, type: 'from' },
              { ...loop, y: 15 },
            ]}
          >
            <ellipse
              id="Oval-9-Copy-4"
              cx="100"
              cy="100"
              rx="6"
              ry="6"
              stroke="#2F54EB"
              strokeWidth="1.6"
            />
          </TweenOne>
          <TweenOne
            component="g"
            animation={[
              { opacity: 0, type: 'from' },
              { ...loop, y: -15 },
            ]}
          >
            <g transform="translate(200 400)">
              <g style={{ transformOrigin: '50% 50%', transform: 'rotate(-340deg)' }}>
                <rect stroke="#FADB14" strokeWidth="1.6" width="9" height="9" />
              </g>
            </g>
          </TweenOne>
        </svg>
        <ScrollParallax
          location="landinglogo"
          className="landinglogo-bg"
          animation={{ playScale: [1, 1.5], rotate: 0 }}
        />
      </div>
      <QueueAnim className="landinglogo page" type="alpha" delay={150}>
        <QueueAnim className="text-wrapper" key="text" type="bottom">
          <div className="ml-5">
            <h3 className="pl-5">デジ 道場</h3>
            <h1 className="pl-5">Digi Dojo</h1>
            <h3 className="pl-5">Mentorship and Learning Platform</h3>
          </div>
        </QueueAnim>
        <div className="img-wrapper mr-4" key="image">
          <ScrollParallax
            location="landinglogo"
            component={LandingLogoImage}
            animation={{ playScale: [1, 1.5], y: 80 }}
          />
        </div>
      </QueueAnim>
      <FeaturedMentors />
    </div>
  )
}

export default Logo

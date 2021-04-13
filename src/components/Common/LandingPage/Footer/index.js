import React from 'react'
import TweenOne from 'rc-tween-one'
import OverPack from 'rc-scroll-anim/lib/ScrollOverPack'
import QueueAnim from 'rc-queue-anim'
import { Row } from 'antd'
import { DIGI_DOJO } from 'constants/text'

const Footer = () => {
  return (
    <div className="home-page-wrapper footer-wrapper">
      <OverPack className="footer" playScale={0.2}>
        <QueueAnim
          type="bottom"
          key="ul"
          leaveReverse
          component={Row}
          className="home-page"
          gutter={0}
        >
          <div className="block text-center">
            <h2 className="logo">
              <img src="/resources/images/digidojo_logo.svg" width="100%" alt={DIGI_DOJO} />
            </h2>
            <div className="slogan mt-4">Digi Dojo</div>
          </div>
          <div className="block ml-5 ml-md-0">
            <h2>Our Services</h2>
            <a href="/mentorships">Mentorships</a>
            <a href="/courses">Courses</a>
          </div>
        </QueueAnim>
        <TweenOne
          animation={{ y: '+=30', opacity: 0, type: 'from' }}
          key="copyright"
          className="copyright-wrapper"
        >
          <div className="home-page">
            <div className="copyright">
              <span>
                ©2021 by&nbsp;
                <a className="text-white" href="https://digi.dojo">
                  Digi Dojo
                </a>
                &nbsp;All Rights Reserved
              </span>
            </div>
          </div>
        </TweenOne>
      </OverPack>
    </div>
  )
}

export default Footer

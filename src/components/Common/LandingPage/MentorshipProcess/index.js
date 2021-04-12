import React from 'react'
import QueueAnim from 'rc-queue-anim'
import TweenOne from 'rc-tween-one'
import { Row, Col } from 'antd'
import OverPack from 'rc-scroll-anim/lib/ScrollOverPack'
import { map } from 'lodash'

const MentorshipProcess = () => {
  const renderMentorshipSteps = (step, index) => {
    let clearFloatNum = 0
    const delay = index * 50
    const liAnim = {
      opacity: 0,
      type: 'from',
      ease: 'easeOutQuad',
      delay,
    }
    const childrenAnim = { ...liAnim, x: '+=10', delay: delay + 100 }
    clearFloatNum += 8
    clearFloatNum = clearFloatNum > 24 ? 0 : clearFloatNum

    return (
      <TweenOne
        component={Col}
        animation={liAnim}
        key={step.key}
        componentProps={{ xs: 24 }}
        className={
          !clearFloatNum ? `${'mentorship-block' || ''} clear-both`.trim() : 'mentorship-block'
        }
      >
        <TweenOne
          animation={{
            x: '-=10',
            opacity: 0,
            type: 'from',
            ease: 'easeOutQuad',
          }}
          key="img"
          className="mentorship-icon"
        >
          <img src={step.url} width="100%" alt="img" />
        </TweenOne>
        <div className="mentorship-text">
          <TweenOne key="h2" animation={childrenAnim} component="h2" className="mentorship-title">
            {step.title}
          </TweenOne>
          <TweenOne
            key="p"
            animation={{ ...childrenAnim, delay: delay + 200 }}
            component="div"
            className="mentorship-content"
          >
            {step.subtitle}
          </TweenOne>
        </div>
      </TweenOne>
    )
  }

  return (
    <div className="home-page-wrapper mentorship-wrapper">
      <div className="home-page mentorship">
        <div className="title-wrapper">
          <h1 className="title-h1">The Digi Dojo Mentorship Process</h1>
          <div className="title-content">A brief guide to securing your first mentorship.</div>
        </div>
        <OverPack playScale={0.3}>
          <QueueAnim key="u" type="bottom">
            <Row key="row" className="mentorship-block-wrapper">
              {map(mentorshipProcessSteps, (step, index) => {
                return renderMentorshipSteps(step, index)
              })}
            </Row>
          </QueueAnim>
        </OverPack>
      </div>
    </div>
  )
}

export default MentorshipProcess

const mentorshipProcessSteps = [
  {
    key: 'discover',
    title: '1. Discover',
    subtitle: 'Identify an area you would like to learn a new skill or further develop.',
    url: '/resources/images/pages/mentorship/discover.svg',
  },
  {
    key: 'search',
    title: '2. Search',
    subtitle:
      'Browse our mentorship page to find out if there are any suitable mentors in the field you are interested in.',
    url: '/resources/images/pages/mentorship/search.svg',
  },
  {
    key: 'apply',
    title: '3. Apply',
    subtitle:
      'Apply for the mentorship you found by providing your details to the prospective mentor, who will review your application and approve if they would like to work with you.',
    url: '/resources/images/pages/mentorship/apply.svg',
  },
  {
    key: 'waitorexplore',
    title: '4. Wait or Explore',
    subtitle:
      'While waiting for a response from your prospective mentor, feel free to explore the site by browsing through other mentorship listings or purchase courses by your prospective mentor.',
    url: '/resources/images/pages/mentorship/waitorexplore.svg',
  },
  {
    key: 'begin',
    title: '5. Begin Mentorship',
    subtitle:
      'Once your mentorship is approved, you may begin to buy passes and book consultations with your mentor to discuss how you can achieve your goals.',
    url: '/resources/images/pages/mentorship/begin.svg',
  },
  {
    key: 'review',
    title: '6. Review & Testimonial',
    subtitle:
      'At the end of your mentorship, you may request for your mentor to write a testimonial to vouch for your abilities, if you feel that you have achieved your goals. Feel free to give a review for your mentor as well.',
    url: '/resources/images/pages/mentorship/review.svg',
  },
]

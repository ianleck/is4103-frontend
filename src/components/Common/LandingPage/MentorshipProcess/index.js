import React from 'react'
import QueueAnim from 'rc-queue-anim'
import TweenOne from 'rc-tween-one'
import { Row, Col } from 'antd'
import OverPack from 'rc-scroll-anim/lib/ScrollOverPack'
import { map } from 'lodash'
import { mentorshipProcessSteps } from 'constants/hardcode/landing'

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

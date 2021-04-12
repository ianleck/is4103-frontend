import React from 'react'
import QueueAnim from 'rc-queue-anim'
import { Row, Col, Image, Carousel } from 'antd'
import OverPack from 'rc-scroll-anim/lib/ScrollOverPack'
import { map } from 'lodash'

const WhatWeOffer = () => {
  return (
    <div className="home-page-wrapper offer-wrapper">
      <div className="home-page offer">
        <h1 className="title-wrapper">What We Offer</h1>
        <div className="banner-carousel">
          <Carousel autoplay autoplaySpeed={7500}>
            <Image src="/resources/images/pages/landing/banners/2.png" />
            <Image src="/resources/images/pages/landing/banners/3.png" />
            <Image src="/resources/images/pages/landing/banners/4.png" />
          </Carousel>
        </div>
        <OverPack playScale={0.1}>
          <QueueAnim
            type="bottom"
            key="block"
            leaveReverse
            component={Row}
            componentProps={{ className: 'offer-block-wrapper' }}
          >
            {map(offers, offer => {
              return (
                <Col key={offer.title.toLowerCase()} className="offer-block" md={12}>
                  <div className="offer-block-item">
                    <div className="offer-block-icon">
                      <img src={offer.url} alt={`offer-${offer.title.toLowerCase()}`} />
                    </div>
                    <div className="offer-block-title">{offer.title}</div>
                    <div className="offer-block-subtitle">{offer.subtitle}</div>
                  </div>
                </Col>
              )
            })}
          </QueueAnim>
        </OverPack>
      </div>
    </div>
  )
}

export default WhatWeOffer

const offers = [
  {
    title: 'Mentorships',
    subtitle:
      'Achieve your goals by consulting our mentors and make sure you are well-equipped to handle the journey ahead.',
    url: '/resources/images/pages/icons/mentorship.svg',
  },
  {
    title: 'Courses',
    subtitle:
      'If you prefer a more laid-back approach, feel free to learn from the mentors on our platform through their various online courses.',
    url: '/resources/images/pages/icons/course.svg',
  },
  {
    title: 'Achievements',
    subtitle:
      'We award certificates of achievements based on your level of completion. This way, you get proof of your hard work and it also helps boost your portfolio.',
    url: '/resources/images/pages/icons/achievement.svg',
  },
  {
    title: 'Social Network',
    subtitle:
      'In order to help you stay connected with your mentors, we have integrated our own social network as a convenient method of communication.',
    url: '/resources/images/pages/icons/socialnetworking.svg',
  },
]

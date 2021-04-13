import React from 'react'
import QueueAnim from 'rc-queue-anim'
import { Row, Col, Image, Carousel } from 'antd'
import OverPack from 'rc-scroll-anim/lib/ScrollOverPack'
import { map } from 'lodash'
import { offers } from 'constants/hardcode'

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

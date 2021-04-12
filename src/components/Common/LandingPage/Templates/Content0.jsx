import React from 'react'
import QueueAnim from 'rc-queue-anim'
import { Row, Col, Image, Carousel } from 'antd'
import OverPack from 'rc-scroll-anim/lib/ScrollOverPack'
import { getChildrenToRender } from 'components/utils'

class Content extends React.PureComponent {
  render() {
    const { dataSource, isMobile, ...props } = this.props
    const { wrapper, titleWrapper, page, OverPack: overPackData, childWrapper } = dataSource
    return (
      <div {...props} {...wrapper}>
        <div {...page}>
          <div {...titleWrapper}>{titleWrapper.children.map(getChildrenToRender)}</div>

          <div className="banner-carousel">
            <Carousel autoplay autoplaySpeed={7500}>
              <Image src="/resources/images/pages/landing/banners/2.png" />
              <Image src="/resources/images/pages/landing/banners/3.png" />
              <Image src="/resources/images/pages/landing/banners/4.png" />
            </Carousel>
          </div>
          <OverPack {...overPackData}>
            <QueueAnim
              type="bottom"
              key="block"
              leaveReverse
              component={Row}
              componentProps={childWrapper}
            >
              {childWrapper.children.map((block, i) => {
                const { children: item, ...blockProps } = block
                return (
                  <Col key={i.toString()} {...blockProps}>
                    <div {...item}>{item.children.map(getChildrenToRender)}</div>
                  </Col>
                )
              })}
            </QueueAnim>
          </OverPack>
        </div>
      </div>
    )
  }
}

export default Content

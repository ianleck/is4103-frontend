import React from 'react'
import PropTypes from 'prop-types'
import TweenOne from 'rc-tween-one'
import QueueAnim from 'rc-queue-anim'
import ScrollParallax from 'rc-scroll-anim/lib/ScrollParallax'
import Content5 from 'components/Common/LandingPage/Templates/Content5'
import LandingLogoImage from './LandingLogoImage'

const loop = {
  duration: 3000,
  yoyo: true,
  repeat: -1,
}

class LandingLogo extends React.PureComponent {
  static propTypes = {
    className: PropTypes.string,
  }

  static defaultProps = {
    className: 'landinglogo',
  }

  render() {
    const { className } = this.props

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
        <QueueAnim className={`${className} page`} type="alpha" delay={150}>
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
        <Content5 id="Content5_0" key="Content5_0" dataSource={Content50DataSource} />
      </div>
    )
  }
}

export const Content50DataSource = {
  wrapper: { className: 'home-page-wrapper content5-wrapper page2' },
  page: { className: 'home-page content5' },
  OverPack: { playScale: 0.1, className: '' },
  titleWrapper: {
    className: 'title-wrapper',
    children: [
      { name: 'title', children: 'Our Featured Mentors', className: 'title-h1' },
      {
        name: 'content',
        className: 'text-white',
        children:
          'Featuring worldwide sensations like Bill Gates & Mark Zuckerberg, join us to get a chance to learn from the best.',
      },
    ],
  },
  block: {
    className: 'content5-img-wrapper',
    gutter: 16,
    children: [
      {
        name: 'block0',
        className: 'block',
        md: 6,
        xs: 24,
        children: {
          wrapper: { className: 'content5-block-content' },
          img: {
            children: 'https://t.alipayobjects.com/images/rmsweb/T11aVgXc4eXXXXXXXX.svg',
          },
          content: { children: 'Ant Design' },
        },
      },
      {
        name: 'block1',
        className: 'block',
        md: 6,
        xs: 24,
        children: {
          wrapper: { className: 'content5-block-content' },
          img: {
            children: 'https://zos.alipayobjects.com/rmsportal/faKjZtrmIbwJvVR.svg',
          },
          content: { children: 'Ant Motion' },
        },
      },
      {
        name: 'block2',
        className: 'block',
        md: 6,
        xs: 24,
        children: {
          wrapper: { className: 'content5-block-content' },
          img: {
            children: 'https://t.alipayobjects.com/images/rmsweb/T11aVgXc4eXXXXXXXX.svg',
          },
          content: { children: 'Ant Design' },
        },
      },
      {
        name: 'block3',
        className: 'block',
        md: 6,
        xs: 24,
        children: {
          wrapper: { className: 'content5-block-content' },
          img: {
            children: 'https://zos.alipayobjects.com/rmsportal/faKjZtrmIbwJvVR.svg',
          },
          content: { children: 'Ant Motion' },
        },
      },
    ],
  },
}

export default LandingLogo

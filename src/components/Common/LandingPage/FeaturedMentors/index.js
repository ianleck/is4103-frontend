import React from 'react'
import { TweenOneGroup } from 'rc-tween-one'
import { useHistory } from 'react-router-dom'
import { sendToSocialProfile } from 'components/utils'
import { map } from 'lodash'

const FeaturedMentors = () => {
  const history = useHistory()

  const FeaturedMentorCard = ({ mentor }) => {
    return (
      <div className="block col-12 col-sm-6 col-md-3">
        <div className="mentors-block-content">
          <a
            role="button"
            tabIndex={0}
            onClick={() => sendToSocialProfile(history, mentor.accountId)}
            onKeyDown={e => e.preventDefault()}
          >
            <span>
              <img src={mentor.img} width="100%" alt="img" />
            </span>
            <p>{mentor.name}</p>
          </a>
        </div>
      </div>
    )
  }

  return (
    <div className="mentors-wrapper home-page-wrapper">
      <div className="home-page mentors">
        <div className="title-wrapper">
          <h1>Our Featured Mentors</h1>
          <div className="text-white">
            Featuring worldwide sensations like Bill Gates & Mark Zuckerberg, join us to get a
            chance to learn from the best.
          </div>
        </div>
        <div className="content-template">
          <TweenOneGroup
            key="ul"
            enter={{
              y: '+=30',
              opacity: 0,
              type: 'from',
              ease: 'easeInOutQuad',
            }}
            leave={{ y: '+=30', opacity: 0, ease: 'easeInOutQuad' }}
            className="mentors-img-wrapper"
          >
            <div className="row">
              {map(mentorData, mentor => {
                return <FeaturedMentorCard key={mentor.accountId} mentor={mentor} />
              })}
            </div>
          </TweenOneGroup>
        </div>
      </div>
    </div>
  )
}

const mentorData = [
  {
    name: 'Bill Gates',
    accountId: '4601895e-0c58-445d-8613-44f568e2f2f0',
    img: '/resources/images/avatars/sample/billgates.jpg',
  },
  {
    name: 'Mark Zuckerberg',
    accountId: '8ee5934e-08c8-4afd-919b-dbfba131c851',
    img: '/resources/images/avatars/sample/markzuckerberg.jpg',
  },
  {
    name: '이지은 (IU)',
    accountId: '690562e9-5697-4a78-8050-20568802d3d5',
    img: '/resources/images/avatars/sample/leejieun.jpg',
  },
  {
    name: 'Sam McDonald',
    accountId: 'a09b9e6d-5876-4958-bbbc-fd6f209e93d6',
    img: '/resources/images/avatars/sample/sammcdonald.jpg',
  },
]

export default FeaturedMentors

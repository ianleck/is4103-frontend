import React from 'react'
import { TweenOneGroup } from 'rc-tween-one'
import { useHistory } from 'react-router-dom'
import { sendToSocialProfile } from 'components/utils'
import { map } from 'lodash'
import { mentorData } from 'constants/hardcode/landing'
import { useSelector } from 'react-redux'

const FeaturedMentors = () => {
  const user = useSelector(state => state.user)
  const history = useHistory()

  const FeaturedMentorCard = ({ mentor }) => {
    return (
      <div className="block col-12 col-sm-6 col-md-3">
        <div className="mentors-block-content">
          <a
            role="button"
            tabIndex={0}
            onClick={() => sendToSocialProfile(user, history, mentor.accountId)}
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
          <div className="subtitle">
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

export default FeaturedMentors

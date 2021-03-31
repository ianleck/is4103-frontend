import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useHistory, useParams } from 'react-router-dom'
import { Button, Descriptions, List, Rate, Typography } from 'antd'
import { Helmet } from 'react-helmet'
import { getCourseById } from 'services/courses'
import { indexOf, isEmpty, isNil, map, random } from 'lodash'
import { ArrowLeftOutlined } from '@ant-design/icons'
import {
  ADD_TO_CART,
  CANCEL_FLW_REQ,
  CREATOR_INFO,
  CURRENT_PRICE,
  DIGI_DOJO_SENSEI,
  FOLLOW,
  NA,
  UNFOLLOW,
} from 'constants/text'
import { formatTime, sendToSocialProfile } from 'components/utils'
import { FOLLOWING_ENUM, USER_TYPE_ENUM } from 'constants/constants'

const ViewCourseDetailsPublic = () => {
  const dispatch = useDispatch()
  const history = useHistory()
  const user = useSelector(state => state.user)
  const { id } = useParams()

  const [currentCourse, setCurrentCourse] = useState('')
  const [currentSensei, setCurrentSensei] = useState('')

  useEffect(() => {
    const viewCourse = async () => {
      const result = await getCourseById(id)
      if (result && !isNil(result.course)) {
        setCurrentCourse(result.course)
        setCurrentSensei(result.course.Sensei)
      }
    }
    viewCourse()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const addToCart = () => {
    if (!isEmpty(user.accessToken))
      dispatch({
        type: 'cart/ADD_COURSE_TO_CART',
        payload: { courseId: id },
      })
    else history.push('/auth/login')
  }

  const FollowButton = ({ targetAccountId }) => {
    const social = useSelector(state => state.social)

    const socialAction = actionType => {
      const getAction = () => {
        switch (actionType) {
          case 'follow':
            return 'social/FOLLOW_USER'
          case 'unfollow':
            return 'social/UNFOLLOW_USER'
          case 'cancel_follow_request':
            return 'social/CANCEL_FOLLOW_REQUEST'
          default:
            return ''
        }
      }
      if (['follow', 'unfollow', 'cancel_follow_request'].indexOf(actionType) !== -1) {
        dispatch({
          type: getAction(),
          payload: {
            targetAccountId,
          },
        })
      }

      getCurrentFollowStatus()
    }

    const getCurrentFollowStatus = () => {
      if (
        social.pendingAndFollowingList.findIndex(
          o => o.followingId === targetAccountId && o.followingStatus === FOLLOWING_ENUM.PENDING,
        ) >= 0
      )
        return 'pending'
      if (
        social.pendingAndFollowingList.findIndex(
          o => o.followingId === targetAccountId && o.followingStatus === FOLLOWING_ENUM.APPROVED,
        ) >= 0
      )
        return 'following'
      return false
    }

    const getButtonElements = type => {
      const followingStatus = getCurrentFollowStatus()
      switch (followingStatus) {
        case 'pending':
          if (type === 'className') return 'btn btn-default'
          if (type === 'onClick') {
            socialAction('cancel_follow_request')
          }
          if (type === 'buttonLabel') return CANCEL_FLW_REQ
          break
        case 'following':
          if (type === 'className') return 'btn btn-primary'
          if (type === 'onClick') {
            socialAction('unfollow')
          }
          if (type === 'buttonLabel') return UNFOLLOW
          break
        default:
          if (type === 'className') return 'btn btn-light'
          if (type === 'onClick') {
            socialAction('follow')
          }
          if (type === 'buttonLabel') return FOLLOW
          break
      }
      return false
    }

    useEffect(() => {
      dispatch({
        type: 'social/LOAD_CURRENT_SOCIAL',
      })
      getCurrentFollowStatus()
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    return (
      <Button
        block
        className={getButtonElements('className')}
        size="large"
        onClick={() => getButtonElements('onClick')}
      >
        {getButtonElements('buttonLabel')}
      </Button>
    )
  }

  return (
    <div className="container">
      <Helmet title="View Course" />
      <div className="row pt-2">
        <div className="col-12 col-md-3 col-lg-2 mt-4 mt-md-0">
          <Button
            block
            type="primary"
            size="large"
            shape="round"
            icon={<ArrowLeftOutlined />}
            onClick={() => history.goBack()}
          >
            Back
          </Button>
        </div>
      </div>
      <div className="row mt-4">
        <div className="col-12 col-lg-8 text-center text-lg-left order-12 order-lg-1">
          <div>
            <h1 className="text-dark text-uppercase text-break">
              <strong>{currentCourse.title}</strong>
            </h1>
          </div>

          <div className="mt-4">
            <h4>{currentCourse.subTitle}</h4>
          </div>

          <div>
            <Rate disabled defaultValue={currentCourse.rating} />
            <small>&nbsp;&nbsp;{random(1, 15000)}</small>
          </div>

          <div className="mt-2">
            <small className="text-uppercase text-secondary">
              Last Updated On {formatTime(currentCourse.updatedAt)}
            </small>
          </div>
          <hr className="mt-4" />

          <div className="mt-4">
            <h3>Course Description</h3>
            <h5 className="mt-4 description-body">{currentCourse.description}</h5>
          </div>
          <hr className="mt-4" />

          <div className="mt-4">
            <h3>Lessons in Course</h3>
            <div className="mt-4">
              <List
                bordered
                dataSource={map(currentCourse.Lessons, lesson => ({
                  ...lesson,
                  listNumber: indexOf(
                    currentCourse.Lessons.sort(
                      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
                    ),
                    lesson,
                  ),
                }))}
                renderItem={item => (
                  <List.Item>
                    <Typography.Text>Lesson {item.listNumber}:</Typography.Text> {item.title}
                  </List.Item>
                )}
              />
            </div>
          </div>
        </div>

        <div className="col-12 col-lg-4 order-1 order-lg-12">
          <div className="card">
            <div className="course-card-img-holder overflow-scroll">
              <img
                className="course-card-img"
                alt="example"
                src={
                  !isNil(currentCourse.imgUrl)
                    ? currentCourse.imgUrl
                    : '/resources/images/course-placeholder.png'
                }
              />
            </div>
            <div className="card-body">
              <span className="text-secondary text-uppercase">{CURRENT_PRICE}</span>
              <h2 className="font-weight-bold">
                ${parseFloat(currentCourse.priceAmount).toFixed(2)}
              </h2>
              <Button
                block
                type="primary"
                size="large"
                className="mt-4"
                onClick={() => addToCart()}
              >
                {ADD_TO_CART}
              </Button>
              <hr className="mt-4" />
              <div className="mt-4">
                <small className="text-uppercase text-secondary">{CREATOR_INFO}</small>
                <div className="row mt-2 align-items-center">
                  <div className="col-auto">
                    <div className="kit__utils__avatar kit__utils__avatar--size64 mb-3">
                      {currentSensei.profileImgUrl ? (
                        <img
                          src={`${currentSensei.profileImgUrl}?${new Date().getTime()}`}
                          alt="Display Pic"
                        />
                      ) : (
                        <img src="/resources/images/avatars/master.png" alt="Display Pic" />
                      )}
                    </div>
                  </div>
                </div>
                <div className="row">
                  <div className="col-12">
                    <a
                      className="h3 font-weight-bold"
                      href="#"
                      onClick={() =>
                        sendToSocialProfile(history, USER_TYPE_ENUM.SENSEI, currentCourse.accountId)
                      }
                    >
                      {`${isNil(currentSensei.firstName) ? 'Anonymous' : currentSensei.firstName} ${
                        isNil(currentSensei.lastName) ? 'Pigeon' : currentSensei.lastName
                      }`}
                    </a>
                  </div>
                  <div className="col-12 mt-2">
                    <div className="h5 text-uppercase">{DIGI_DOJO_SENSEI}</div>
                  </div>
                  <div className="col-12 mt-2">
                    <FollowButton targetAccountId={currentCourse.accountId} />
                  </div>
                  <div className="col-12 mt-4">
                    <Descriptions
                      title="Credentials"
                      bordered
                      size="small"
                      column={{ xxl: 1, xl: 1, lg: 1, md: 1, sm: 1, xs: 1 }}
                    >
                      <Descriptions.Item label="Occupation">
                        {!isNil(currentSensei.occupation) ? currentSensei.occupation : NA}
                      </Descriptions.Item>
                    </Descriptions>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ViewCourseDetailsPublic

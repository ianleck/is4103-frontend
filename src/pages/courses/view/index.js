/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useHistory, useParams } from 'react-router-dom'
import { Button, Image, List, Rate, Skeleton, Typography } from 'antd'
import { Helmet } from 'react-helmet'
import { getCourseById } from 'services/courses'
import { indexOf, isEmpty, isNil, map, random } from 'lodash'
import { ADD_TO_CART, CURRENT_PRICE } from 'constants/text'
import { formatTime, getUserFirstName, sortArrByCreatedAt } from 'components/utils'
import { DEFAULT_TIMEOUT, DIRECTION, FRONTEND_API } from 'constants/constants'
import ShareBtn from 'components/Common/Social/ShareBtn'
import CreatorInfo from 'components/Common/CreatorInfo'
import BackBtn from 'components/Common/BackBtn'
import PageHeader from 'components/Common/PageHeader'
import { getProfile } from 'services/user'
import ProfilePrivateCard from 'components/Common/Social/ProfilePrivateCard'
import PersonalInformationCard from 'components/Profile/PersonalInformationCard'
import AboutCard from 'components/Profile/AboutCard'
import IndustryCard from 'components/Profile/IndustryCard'
import OccupationCard from 'components/Profile/OccupationCard'
import PersonalityCard from 'components/Profile/PersonalityCard'
import ProfileBlockedCard from 'components/Common/Social/ProfileBlockedCard'

const ViewCourseDetailsPublic = () => {
  const dispatch = useDispatch()
  const history = useHistory()
  const user = useSelector(state => state.user)
  const { id } = useParams()

  const [currentCourse, setCurrentCourse] = useState('')
  const [currentSensei, setCurrentSensei] = useState('')
  const [isLoading, setIsLoading] = useState(true)

  const [currentTab, setCurrentTab] = useState('info')
  const [viewUser, setViewUser] = useState('')
  const [isBlocked, setIsBlocked] = useState('')

  const changeTab = tab => {
    setCurrentTab(tab)
  }

  const viewCourse = async () => {
    setIsLoading(true)
    const result = await getCourseById(id)
    if (result && !isNil(result.course)) {
      setCurrentCourse(result.course)
      setCurrentSensei(result.course.Sensei)
    }
    setTimeout(() => {
      setIsLoading(false)
    }, DEFAULT_TIMEOUT)
  }

  const getUserProfile = async () => {
    setIsLoading(true)
    if (!isNil(currentCourse.accountId)) {
      const response = await getProfile(currentCourse.accountId)
      if (response) {
        setViewUser(response)
        if (!isNil(response.isBlocking)) setIsBlocked(response.isBlocking)
      }
    }
    setTimeout(() => {
      setIsLoading(false)
    }, DEFAULT_TIMEOUT)
  }

  const addToCart = () => {
    if (!isEmpty(user.accessToken))
      dispatch({
        type: 'cart/ADD_COURSE_TO_CART',
        payload: { courseId: id },
      })
    else {
      dispatch({
        type: 'settings/SET_STATE',
        payload: {
          rememberPath: `/courses/${id}`,
        },
      })
      history.push('/auth/login')
    }
  }

  useEffect(() => {
    viewCourse()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    if (currentTab === 'profile') getUserProfile()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentTab])

  const CourseInfo = () => {
    return (
      <div>
        <span className="h3 font-weight-bold">{currentCourse.title}</span>
        <div className="mt-2">
          <span>{currentCourse.subTitle}</span>
        </div>

        <div className="mt-2">
          <Rate disabled defaultValue={currentCourse.rating} />
        </div>

        <div className="mt-2">
          <small className="text-muted text-uppercase">
            {`Last Updated On ${formatTime(currentCourse.updatedAt)}`}
          </small>
        </div>
        <hr className="mt-4" />

        <div className="mt-4">
          <h3>Course Description</h3>
          <span className="mt-4 description-body">{currentCourse.description}</span>
        </div>
        <hr className="mt-4" />

        <div className="mt-4">
          <h3>Lessons in Course</h3>
          <div className="mt-4">
            <List
              bordered
              dataSource={
                currentCourse.Lessons && sortArrByCreatedAt(currentCourse.Lessons, DIRECTION.ASC)
              }
              renderItem={item => <List.Item>{item.title}</List.Item>}
            />
          </div>
        </div>
      </div>
    )
  }

  const SenseiProfile = () => {
    if (viewUser.isPrivateProfile) return <ProfilePrivateCard />
    if (!isBlocked && !viewUser.isPrivateProfile)
      return (
        <div>
          <PersonalInformationCard user={viewUser} />
          <AboutCard user={viewUser} />
          <IndustryCard user={viewUser} />
          <OccupationCard user={viewUser} />
          <PersonalityCard user={viewUser} />
        </div>
      )
    return <ProfileBlockedCard />
  }

  const CourseActions = () => {
    return (
      <div className="card">
        <div className="course-card-img-max overflow-hidden">
          <Image
            className="course-card-img"
            src={
              !isNil(currentCourse.imgUrl)
                ? currentCourse.imgUrl
                : '/resources/images/course-placeholder.png'
            }
          />
        </div>
        <div className="card-body">
          <span className="text-secondary text-uppercase">{CURRENT_PRICE}</span>
          <h2 className="font-weight-bold">${parseFloat(currentCourse.priceAmount).toFixed(2)}</h2>
          <div className="row align-items-center">
            <div className="col pr-0">
              <Button
                block
                type="primary"
                size="large"
                className="mt-3"
                onClick={() => addToCart()}
              >
                {ADD_TO_CART}
              </Button>
            </div>
            <div className="col-auto">
              <ShareBtn
                quote={`${getUserFirstName(user)} is sharing this course: [${
                  currentCourse.title
                }] with you!`}
                url={`${FRONTEND_API}/courses/${currentCourse.courseId}`}
                btnClassName="mt-3"
              />
            </div>
          </div>
          <hr className="mt-4" />
          <div className="mt-4">
            <CreatorInfo
              history={history}
              sensei={currentSensei}
              accountId={currentCourse.accountId}
            />
          </div>
        </div>
      </div>
    )
  }

  return (
    <div>
      <Helmet title="View Course" />
      <div className="row pt-2">
        <div className="col-12 col-md-3 col-lg-2 mt-4 mt-md-0">
          <BackBtn />
        </div>
      </div>
      <PageHeader type="course" course={currentCourse}>
        <div className="col-12 col-sm-auto col-lg-auto ml-lg-auto pr-0 mt-4 mt-lg-0">
          <Button
            key="course-tab"
            type={currentTab === 'info' ? 'primary' : 'default'}
            size="large"
            onClick={() => changeTab('info')}
          >
            Course Info
          </Button>
        </div>
        <div className="col-auto col-sm-auto col-lg-auto pl-sm-2 pr-0 mt-4 mt-lg-0">
          <Button
            key="reviews-tab"
            type={currentTab === 'reviews' ? 'primary' : 'default'}
            size="large"
            onClick={() => changeTab('reviews')}
          >
            Reviews
          </Button>
        </div>
        <div className="col-auto col-sm-auto col-lg-auto pl-sm-2 mt-4 mt-lg-0">
          <Button
            key="profile-tab"
            type={currentTab === 'profile' ? 'primary' : 'default'}
            size="large"
            onClick={() => changeTab('profile')}
          >
            Sensei Profile
          </Button>
        </div>
      </PageHeader>
      <div className="row mt-4 pl-md-5 pr-md-5 pt-lg-2">
        <div className="col-12 col-lg-8 text-center text-lg-left order-12 order-lg-1">
          <Skeleton active loading={isLoading}>
            {currentTab === 'info' && <CourseInfo />}
            {currentTab === 'profile' && <SenseiProfile />}
          </Skeleton>
        </div>
        <div className="col-12 col-lg-4 order-1 order-lg-12">
          <CourseActions />
        </div>
      </div>
    </div>
  )
}

export default ViewCourseDetailsPublic

import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { useHistory, useParams } from 'react-router-dom'
import { Button, Descriptions, List, Rate, Typography, notification } from 'antd'
import { Helmet } from 'react-helmet'
import { getCourseById } from 'services/courses'
import { indexOf, isNil, map, random } from 'lodash'
import { ArrowLeftOutlined } from '@ant-design/icons'
import { ADD_TO_CART, CREATOR_INFO, CURRENT_PRICE, NA } from 'constants/text'
import { formatTime } from 'components/utils'
import { getProfile } from 'services/jwt'
import { addCourseToCart } from 'services/jwt/cart'

const ViewCourseDetailsPublic = () => {
  const history = useHistory()
  const { id } = useParams()
  const user = useSelector(state => state.user)

  const [currentCourse, setCurrentCourse] = useState('')
  const [currentSensei, setCurrentSensei] = useState('')

  useEffect(() => {
    if (!user.authorized) {
      history.push('/auth/login')
      return
    }
    const viewCourse = async () => {
      const result = await getCourseById(id)
      console.log(result)
      if (result && !isNil(result.course)) {
        setCurrentCourse(result.course)
        const senseiProfile = await getProfile(result.course.accountId)
        setCurrentSensei(senseiProfile)
        console.log('senseiProfile', senseiProfile)
        console.log('currentSensei', currentSensei)
      }
    }
    viewCourse()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const addToCart = async () => {
    const courseId = id
    const response = await addCourseToCart(courseId)

    console.log('response', response)

    if (response && response.success) {
      notification.success({
        message: 'Success',
        description: response.message,
      })
    }
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
            <h1 className="text-dark text-uppercase">
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
            <h5 className="mt-4">{currentCourse.description}</h5>
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
                    <Typography.Text>Lesson {item.listNumber}</Typography.Text> {item.title}
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
                    <a className="h3 font-weight-bold" href="#" onClick={() => history.goBack()}>
                      {`${isNil(currentSensei.firstName) ? 'Anonymous' : currentSensei.firstName} ${
                        isNil(currentSensei.lastName) ? 'Pigeon' : currentSensei.lastName
                      }`}
                    </a>
                  </div>
                  <div className="col-12 mt-2">
                    <div className="h5 text-uppercase">Digi Dojo {currentSensei.userType}</div>
                  </div>
                  <div className="col-12 mt-2">
                    <Descriptions
                      title="Credentials"
                      bordered
                      size="small"
                      column={{ xxl: 1, xl: 1, lg: 1, md: 1, sm: 1, xs: 1 }}
                    >
                      <Descriptions.Item label="Industry">
                        {!isNil(currentSensei.industry) ? currentSensei.industry : NA}
                      </Descriptions.Item>
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

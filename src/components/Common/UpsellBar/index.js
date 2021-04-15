import { ArrowLeftOutlined, ArrowRightOutlined } from '@ant-design/icons'
import { Button } from 'antd'
import CourseListingCard from 'components/Course/CourseListingCard'
import MentorshipListingCard from 'components/Mentorship/ShoppingListCard'
import { DEFAULT_TIMEOUT } from 'constants/constants'
import { isEmpty, isNil, map } from 'lodash'
import React, { useEffect, useState } from 'react'
import ScrollMenu from 'react-horizontal-scrolling-menu'
import { upsellCheckout, upsellOnCourses, upsellOnMentorships } from 'services/cart'

const UpsellBar = ({ type, id }) => {
  const [isLoading, setIsLoading] = useState(false)
  const [courses, setCourses] = useState([])
  const [mentorships, setMentorships] = useState([])

  const setLoadingIndicator = loading => {
    if (loading) setIsLoading(true)
    else {
      setTimeout(() => {
        setIsLoading(false)
      }, DEFAULT_TIMEOUT)
    }
  }

  const getUpsellPdts = async () => {
    setLoadingIndicator(true)
    let response
    if (type === 'mentorships') {
      response = await upsellOnMentorships(id)
      setCourses(response.cart)
    }
    if (type === 'courses') {
      response = await upsellOnCourses(id)
      setMentorships(response.cart)
    }
    if (type === 'checkout') {
      response = await upsellCheckout()
      if (response && !isNil(response.cart)) {
        if (!isNil(response.cart.mentorships)) setMentorships(response.cart.mentorships)
        if (!isNil(response.cart.courses)) setCourses(response.cart.courses)
      }
    }
    setLoadingIndicator(false)
  }

  const mapUpsellItems = () => {
    let items = <></>
    if (type === 'mentorships')
      items = map(courses, course => {
        return (
          <CourseListingCard
            className="menu-item m-2"
            key={course.courseId}
            course={course}
            isLoading={isLoading}
            isUpsellItem
          />
        )
      })

    if (type === 'courses')
      items = map(mentorships, mentorship => {
        return (
          <MentorshipListingCard
            className="mentorship-menu-item m-2"
            key={mentorship.mentorshipListingId}
            listing={mentorship}
            isLoading={isLoading}
            isUpsellItem
          />
        )
      })

    if (type === 'checkout') {
      const courseUpsell = map(courses, course => {
        return (
          <CourseListingCard
            className="menu-item m-2"
            key={course.courseId}
            course={course}
            isLoading={isLoading}
            isUpsellItem
          />
        )
      })

      const mentorshipUpsell = map(mentorships, mentorship => {
        return (
          <MentorshipListingCard
            className="mentorship-menu-item m-2"
            key={mentorship.mentorshipListingId}
            listing={mentorship}
            isLoading={isLoading}
            isUpsellItem
          />
        )
      })

      items = [...courseUpsell, ...mentorshipUpsell]
    }

    if (!isEmpty(items)) return items

    return <></>
  }

  const ArrowLeft = () => {
    return (
      <Button
        type="default"
        size="large"
        icon={<ArrowLeftOutlined />}
        className="scroll-menu-arrow--disabled"
      />
    )
  }

  const ArrowRight = () => {
    return (
      <Button
        type="default"
        size="large"
        icon={<ArrowRightOutlined />}
        className="scroll-menu-arrow--disabled"
      />
    )
  }

  useEffect(() => {
    getUpsellPdts()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  if (type === 'mentorships' && isEmpty(courses)) return <></>
  if (type === 'courses' && isEmpty(mentorships)) return <></>
  if (type === 'checkout' && isEmpty(mentorships) && isEmpty(courses)) return <></>
  return (
    <div className="w-100">
      <hr />
      <div className="h4 pt-4 mb-4 pl-3">Related Items</div>
      <ScrollMenu
        data={mapUpsellItems()}
        alignCenter={false}
        arrowLeft={<ArrowLeft />}
        arrowRight={<ArrowRight />}
        wheel={false}
        wrapperClass="w-100 align-items-center"
        arrowDisabledClass="scroll-menu-arrow--disabled"
        hideArrows
        inertiaScrolling
        disableTabindex
      />
    </div>
  )
}

export default UpsellBar

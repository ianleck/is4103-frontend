import React, { useState } from 'react'
import { useSelector } from 'react-redux'
import { Avatar, Button, Divider, Input, Progress, Space } from 'antd'
import BackBtn from 'components/Common/BackBtn'
import { ADD_COMMENTS, COURSE_PROGRESS, LESSON_GUIDE, LESSON_LIST } from 'constants/text'
import ReactPlayer from 'react-player'
import { ArrowLeftOutlined, ArrowRightOutlined } from '@ant-design/icons'

const StudentCourseLesson = () => {
  const LessonComments = () => {
    const user = useSelector(state => state.user)
    const [showCommentField, setShowCommentField] = useState(false)

    const { TextArea } = Input

    const ToggleCommentField = () => {
      return (
        <div className="row no-gutters">
          <div className="col-auto">
            <Avatar
              src={
                user.profileImgUrl
                  ? `${user.profileImgUrl}?${new Date().getTime()}`
                  : '/resources/images/avatars/apprentice.png'
              }
            />
          </div>
          <div
            role="button"
            className="col btn border-0 text-left ml-4"
            tabIndex={0}
            onClick={() => setShowCommentField(true)}
            onKeyDown={event => event.preventDefault()}
          >
            <span className="text-secondary">{ADD_COMMENTS}</span>
            <Divider className="m-0" />
          </div>
        </div>
      )
    }

    const AddCommentField = () => {
      return (
        <div>
          <div className="row no-gutters">
            <div className="col-auto">
              <Avatar
                src={
                  user.profileImgUrl
                    ? `${user.profileImgUrl}?${new Date().getTime()}`
                    : '/resources/images/avatars/apprentice.png'
                }
              />
            </div>
            <div className="col ml-4">
              <TextArea autoSize size="large" placeholder={ADD_COMMENTS} />
            </div>
          </div>
          <div className="row mt-3">
            <div className="col-12 text-right">
              <Space>
                <Button ghost type="primary" onClick={() => setShowCommentField(false)}>
                  Cancel
                </Button>
                <Button type="primary">Comment</Button>
              </Space>
            </div>
          </div>
        </div>
      )
    }

    return (
      <div>
        <div className="col-12 p-0 mt-4">
          {!showCommentField && <ToggleCommentField />}
          {showCommentField && <AddCommentField />}
        </div>
        <div className="col-12 p-0 mt-4">
          <span>Comments</span>
        </div>
      </div>
    )
  }

  const LessonMainContent = () => {
    return (
      <div className="card">
        <div className="card-header">
          <div className="row align-items-center justify-content-between">
            <div className="col-12 col-md-8">
              <h3>Course Name</h3>
              <h5>
                Lesson 0: Title Lesson 0: Title Lesson 0: Title Lesson 0: Title Lesson 0: Title
                Lesson 0: Title Lesson 0: Title Lesson 0: Title
              </h5>
            </div>
            <div className="col-12 col-md-4 text-center text-md-right">
              <Button type="primary" size="large">
                {LESSON_GUIDE}
              </Button>
            </div>
          </div>
        </div>
        <div className="card-body">
          <ReactPlayer controls width="100%" url="hi" />
        </div>
      </div>
    )
  }

  const CourseProgressCard = () => {
    return (
      <div className="card">
        <div className="card-body">
          <h5>{COURSE_PROGRESS}</h5>
          <Progress percent={50} status="active" />
        </div>
      </div>
    )
  }

  const LessonList = () => {
    return (
      <div className="card text-dark">
        <div className="card-header">
          <div className="row align-items-center justify-content-between">
            <div className="col-auto">
              <h5 className="mb-0" style={{ lineHeight: 'normal' }}>
                {LESSON_LIST}
              </h5>
            </div>
            <div className="col text-right">
              <Space>
                <Button type="default" size="large" icon={<ArrowLeftOutlined />} />
                <Button type="default" size="large" icon={<ArrowRightOutlined />} />
              </Space>
            </div>
          </div>
        </div>
        <div className="card-body">
          <span>Lesson List</span>
        </div>
      </div>
    )
  }

  return (
    <div>
      <div className="row pt-2">
        <div className="col-12 col-md-3 col-lg-2 mt-4 mt-md-0">
          <BackBtn />
        </div>
      </div>
      <div className="row mt-5">
        <div className="col-12 col-md-8">
          <LessonMainContent />
          <LessonComments />
        </div>
        <div className="col-12 col-md-4">
          <CourseProgressCard />
          <LessonList />
        </div>
      </div>
    </div>
  )
}

export default StudentCourseLesson

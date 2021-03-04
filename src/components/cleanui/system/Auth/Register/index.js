import React, { useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { Input, Button, Form } from 'antd'
import { Link, Redirect, useLocation } from 'react-router-dom'
import { USER_TYPE_ENUM } from 'constants/constants'

const Register = () => {
  const user = useSelector(state => state.user)
  const dispatch = useDispatch()
  const { pathname } = useLocation()
  const [inputUsername, setInputUsername] = useState('')
  const [inputEmailAddr, setInputEmailAddr] = useState('')

  let isStudent = true

  if (pathname === '/auth/register-sensei') isStudent = false

  if (user.requiresProfileUpdate) {
    switch (user.userType) {
      case USER_TYPE_ENUM.SENSEI:
        return <Redirect to="/sensei/profile" />
      case USER_TYPE_ENUM.STUDENT:
        return <Redirect to="/student/profile" />
      default:
        break
    }
  }

  if (user.authorized && !user.requiresProfileUpdate) {
    switch (user.userType) {
      case USER_TYPE_ENUM.ADMIN:
        return <Redirect to="/admin" />
      case USER_TYPE_ENUM.SENSEI:
        return <Redirect to="/sensei" />
      case USER_TYPE_ENUM.STUDENT:
        return <Redirect to="/" />
      default:
        return <Redirect to="/" />
    }
  }

  const onSubmitRegister = values => {
    values.isStudent = isStudent
    setInputUsername(values.username)
    setInputEmailAddr(values.email)
    console.log(inputUsername)
    dispatch({
      type: 'user/REGISTER',
      payload: values,
    })
  }

  const onFinishFailed = errorInfo => {
    console.log('Failed:', errorInfo)
  }

  const StudentSignUpHeader = () => {
    return (
      <div className="row">
        <div className="col-12 text-center mt-4">
          <img src="../resources/images/digidojo_logo.svg" alt="Digi Dojo Logo" />
        </div>
        <div className="col-12">
          <div className="text-center mt-4 mb-4">
            <h5>
              <strong>Start your learning journey with us here as a Digi Dojo student.</strong>
            </h5>
            <div className="text-center pt-2 mb-4">
              <span className="mr-2">
                Interested to be a <strong>Mentor</strong> or <strong>Course Instructor</strong> on
                Digi Dojo?
              </span>
              <Link to="/auth/register-sensei" className="kit__utils__link font-size-16">
                Apply here
              </Link>
            </div>
          </div>
        </div>
      </div>
    )
  }

  const StudentSignUpFooter = () => {
    return (
      <div>
        <div className="text-center pt-2 mb-auto">
          <span className="mr-2">Already have an account?</span>
          <Link to="/auth/login" className="kit__utils__link font-size-16">
            Sign in
          </Link>
        </div>
        <div className="text-center pt-2 mb-auto">
          <small>
            By signing up, you agree to our&nbsp;
            <a href="#" onClick={e => e.preventDefault()} className="kit__utils__link">
              Terms of Service
            </a>
            &nbsp;and&nbsp;
            <a href="#" onClick={e => e.preventDefault()} className="kit__utils__link">
              Privacy Policy
            </a>
            .
          </small>
        </div>
      </div>
    )
  }

  const SenseiSignUpHeader = () => {
    return (
      <div className="col-12 col-md-6">
        <div className="col-12 text-center text-md-left mt-4">
          <img src="../resources/images/digidojo_logo.svg" alt="Digi Dojo Logo" />
        </div>
        <div className="col-12">
          <div className="text-center text-md-left mt-4 mb-4">
            <h3>
              <strong>Begin teaching with us today.</strong>
            </h3>
            <div className="row mt-4">
              <div className="col-12 mt-2 text-center text-md-left">
                <h5>
                  <i className="fa fa-graduation-cap" />
                  <span>&nbsp;&nbsp;Offer Mentorships</span>
                </h5>
              </div>
              <div className="col-12 mt-2 text-center text-md-left">
                <h5>
                  <i className="fa fa-book" />
                  <span>&nbsp;&nbsp;Sell Courses</span>
                </h5>
              </div>
              <div className="col-12 mt-2 text-center text-md-left">
                <h5>
                  <i className="fa fa-bar-chart" />
                  <span>&nbsp;&nbsp;Track Student Progress</span>
                </h5>
              </div>
              <div className="col-12 mt-2 text-center text-md-left">
                <h5>
                  <i className="fa fa-share-alt" />
                  <span>&nbsp;&nbsp;Mentorship Profile</span>
                </h5>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  const SenseiSignUpFooter = () => {
    return (
      <div className="col-12 mt-2 text-center">
        <small>
          In Digi Dojo, a Sensei is able to offer mentorships to students. Additionally, you will be
          able to make your video lessons available for sale as courses to the public.
        </small>
      </div>
    )
  }

  const RegisterForm = () => {
    return (
      <Form
        layout="vertical"
        hideRequiredMark
        onFinish={onSubmitRegister}
        onFinishFailed={onFinishFailed}
        initialValues={{ username: inputUsername, email: inputEmailAddr }}
        className="mb-4"
      >
        <Form.Item
          name="username"
          preserve
          rules={[{ required: true, message: 'Please input your username' }]}
        >
          <Input size="large" placeholder="Username" value={inputUsername} />
        </Form.Item>
        <Form.Item
          name="email"
          rules={[
            {
              required: true,
              type: 'email',
              message: 'Please enter a valid e-mail address',
            },
          ]}
          validateTrigger="onSubmit"
        >
          <Input size="large" placeholder="Email Address" value={inputEmailAddr} />
        </Form.Item>
        <Form.Item
          name="password"
          rules={[{ required: true, message: 'Please input your password' }]}
        >
          <Input type="password" size="large" placeholder="Password" />
        </Form.Item>
        <Form.Item
          name="confirmPassword"
          rules={[{ required: true, message: 'Please check your password' }]}
        >
          <Input type="password" size="large" placeholder="Confirm Password" />
        </Form.Item>
        <Button
          type="primary"
          htmlType="submit"
          size="large"
          className="text-center w-100"
          loading={user.loading}
        >
          <strong>Sign up</strong>
        </Button>
      </Form>
    )
  }

  const signUpCard = (
    <div>
      <div className="card">
        <div className="card-body">
          {!!isStudent && <StudentSignUpHeader />}
          <div className="row align-items-center">
            {!isStudent && <SenseiSignUpHeader />}
            <div className={isStudent ? 'col-12' : 'col-12 col-md-6 mt-4'}>
              <RegisterForm />
            </div>
          </div>
          {!isStudent && <SenseiSignUpFooter />}
        </div>
      </div>
      {!!isStudent && <StudentSignUpFooter />}
    </div>
  )

  return signUpCard
}

export default Register

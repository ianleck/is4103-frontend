import React from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { Input, Button, Form } from 'antd'
import { Link, Redirect } from 'react-router-dom'
import { USER_TYPE_ENUM } from 'constants/constants'

const Register = () => {
  const user = useSelector(state => state.user)
  const dispatch = useDispatch()

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
    values.isStudent = true
    dispatch({
      type: 'user/REGISTER',
      payload: values,
    })
  }

  const onUpdateProfile = values => {
    values.accountId = user.accountId
    dispatch({
      type: 'user/UPDATE_PROFILE',
      payload: values,
    })
  }

  const onFinishFailed = errorInfo => {
    console.log('Failed:', errorInfo)
  }

  const profileUpdateCard = (
    <div>
      <div className="card">
        <div className="card-body">
          <div className="row">
            <div className="col-12 text-center mt-4">
              <img src="../resources/images/digidojo_logo.svg" alt="Digi Dojo Logo" />
            </div>
            <div className="col-12">
              <div className="text-center mt-4 mb-4">
                <h5>
                  <strong>Let&apos;s get to know each other.</strong>
                </h5>
              </div>
            </div>
          </div>
          <div className="row">
            <div className="col-12">
              <Form
                layout="vertical"
                hideRequiredMark
                onFinish={onUpdateProfile}
                onFinishFailed={onFinishFailed}
                className="mb-4"
              >
                <Form.Item
                  name="firstName"
                  rules={[{ required: true, message: 'Please input your first name' }]}
                >
                  <Input size="large" placeholder="First Name" />
                </Form.Item>
                <Form.Item
                  name="lastName"
                  rules={[{ required: true, message: 'Please input your last name' }]}
                >
                  <Input size="large" placeholder="Last Name" />
                </Form.Item>
                <Form.Item
                  name="contactNumber"
                  rules={[{ required: true, message: 'Please input your contact number' }]}
                >
                  <Input size="large" placeholder="Contact Number" />
                </Form.Item>
                <Button
                  type="primary"
                  htmlType="submit"
                  size="large"
                  className="text-center w-100"
                  loading={user.loading}
                >
                  <strong>Complete Profile</strong>
                </Button>
              </Form>
            </div>
          </div>
        </div>
      </div>
    </div>
  )

  const signUpCard = (
    <div>
      <div className="card">
        <div className="card-body">
          <div className="row">
            <div className="col-12 text-center mt-4">
              <img src="../resources/images/digidojo_logo.svg" alt="Digi Dojo Logo" />
            </div>
            <div className="col-12">
              <div className="text-center mt-4 mb-4">
                <h5>
                  <strong>Start your journey with us here.</strong>
                </h5>
                <div>
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
            </div>
          </div>
          <div className="row">
            <div className="col-12">
              <Form
                layout="vertical"
                hideRequiredMark
                onFinish={onSubmitRegister}
                onFinishFailed={onFinishFailed}
                className="mb-4"
              >
                <Form.Item
                  name="username"
                  rules={[{ required: true, message: 'Please input your username' }]}
                >
                  <Input size="large" placeholder="Username" />
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
                  <Input size="large" placeholder="Email Address" />
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
            </div>
          </div>
        </div>
      </div>
      <div className="text-center pt-2 mb-auto">
        <span className="mr-2">Already have an account?</span>
        <Link to="/auth/login" className="kit__utils__link font-size-16">
          Sign in
        </Link>
      </div>
      <div className="text-center pt-2 mb-auto">
        <span className="mr-2">Interested to be a Mentor or Sensei on Digi Dojo?</span>
        <Link to="/sensei/register" className="kit__utils__link font-size-16">
          Apply here
        </Link>
      </div>
    </div>
  )

  if (user.requiresProfileUpdate) {
    return profileUpdateCard
  }
  return signUpCard
}

export default Register

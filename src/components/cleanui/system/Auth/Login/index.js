import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Input, Button, Form } from 'antd'
import { Link, useLocation, Redirect } from 'react-router-dom'
import FadeIn from 'react-fade-in'
import LogoWithDescription from 'components/Public/Logo/LogoWithDescription'
import { USER_TYPE_ENUM, USER_TYPE_STRING } from 'constants/constants'

const Login = () => {
  const user = useSelector(state => state.user)
  const dispatch = useDispatch()
  const { pathname } = useLocation()
  const loginUserType = RegExp('admin').test(pathname) ? USER_TYPE_ENUM.ADMIN : ''
  const [currentUserType, setCurrentUserType] = useState(loginUserType)
  const isStudent = currentUserType === USER_TYPE_ENUM.STUDENT
  // DEV MODE
  const settings = useSelector(state => state.settings)
  const [inputEmail, setInputEmail] = useState('')
  const [inputPassword, setInputPassword] = useState('')

  if (user.authorized) {
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

  const onFinish = values => {
    setInputEmail(values.email)
    setInputPassword(values.password)
    if (pathname === '/auth/admin') {
      values.isAdmin = true
    }
    dispatch({
      type: 'user/LOGIN',
      payload: values,
    })
  }

  const onFinishFailed = errorInfo => {
    console.log('Failed:', errorInfo)
  }

  const SelectUserType = (
    <FadeIn key="2">
      <div
        style={{
          display: currentUserType === '' ? 'block' : 'none',
        }}
      >
        <div className="row mb-3 align-items-center">
          <div className="col-12 text-center">{LogoWithDescription}</div>
        </div>
        <div className="row justify-content-center">
          <div className="col-12 col-md-4">
            <Button
              block
              type="primary"
              size="large"
              onClick={() => setCurrentUserType(USER_TYPE_ENUM.SENSEI)}
              className="text-center"
            >
              <i className="fa fa-graduation-cap" />
              &nbsp;&nbsp;Login as a {USER_TYPE_STRING.SENSEI}
            </Button>
          </div>
          <div className="col-12 col-md-4 mt-3 mt-md-0">
            <Button
              block
              type="primary"
              size="large"
              onClick={() => setCurrentUserType(USER_TYPE_ENUM.STUDENT)}
              className="text-center"
            >
              <i className="fa fa-user" />
              &nbsp;&nbsp;Login as a {USER_TYPE_STRING.STUDENT}
            </Button>
          </div>
        </div>
      </div>
    </FadeIn>
  )

  const SwitchUserTypeButton = () => {
    return (
      <Button
        type="default"
        size="small"
        className="text-center"
        onClick={() =>
          isStudent
            ? setCurrentUserType(USER_TYPE_ENUM.SENSEI)
            : setCurrentUserType(USER_TYPE_ENUM.STUDENT)
        }
      >
        <span>Login as {isStudent ? USER_TYPE_STRING.SENSEI : USER_TYPE_STRING.STUDENT}</span>
      </Button>
    )
  }

  const generateLoginEmail = () => {
    if (currentUserType === USER_TYPE_ENUM.ADMIN) return 'superadmin@gmail.com'
    if (currentUserType === USER_TYPE_ENUM.SENSEI) return 'sensei@digi.dojo'
    return 'student@digi.dojo'
  }

  const LoginForm = () => {
    return (
      <div className="card">
        <div className="card-body">
          <div className="text-dark text-center font-size-24 mb-3">
            <strong>
              {getPortalName()}
              &nbsp;Portal
            </strong>
          </div>
          <Form
            layout="vertical"
            hideRequiredMark
            onFinish={onFinish}
            onFinishFailed={onFinishFailed}
            className="mb-4"
            initialValues={{
              email: settings.isDevMode ? generateLoginEmail() : inputEmail,
              password: settings.isDevMode ? 'password' : inputPassword,
            }}
          >
            <Form.Item
              name="email"
              rules={[
                { required: true, type: 'email', message: 'Please input a valid e-mail address' },
              ]}
              validateTrigger="onSubmit"
            >
              <Input size="large" placeholder="Email" />
            </Form.Item>
            <Form.Item
              name="password"
              rules={[{ required: true, message: 'Please input your password' }]}
            >
              <Input size="large" type="password" placeholder="Password" />
            </Form.Item>
            <Button
              type="primary"
              size="large"
              className="text-center w-100"
              htmlType="submit"
              loading={user.loading}
            >
              <strong>Login</strong>
            </Button>
          </Form>
          <div className="text-center">
            <Link to="/auth/forgot-password" className="kit__utils__link font-size-16">
              Forgot Password?
            </Link>
          </div>
        </div>
      </div>
    )
  }

  const getPortalName = () => {
    if (isStudent) return USER_TYPE_STRING.STUDENT
    if (loginUserType === USER_TYPE_ENUM.ADMIN) return USER_TYPE_STRING.ADMIN
    return USER_TYPE_STRING.SENSEI
  }

  const UserAdditionalActions = () => {
    if (isStudent || currentUserType === USER_TYPE_ENUM.SENSEI) {
      return (
        <div className="text-center pt-2 mb-auto">
          <div className="text-center mt-3 mb-3">
            <SwitchUserTypeButton />
          </div>
          <span className="mr-2">Don&#39;t have an account?</span>
          <Link to="/auth/register" className="kit__utils__link font-size-16">
            Sign up
          </Link>
        </div>
      )
    }
    return null
  }

  const CommonLoginComponent = (
    <FadeIn key="1">
      <div className="container">
        {SelectUserType}
        <div className="row justify-content-between align-items-center">
          <div className="col-12 col-md-6 text-center">{LogoWithDescription}</div>
          <div className="col-12 col-md-6 mt-3 mt-md-0">
            <LoginForm />
          </div>
        </div>
        <UserAdditionalActions />
      </div>
    </FadeIn>
  )

  if (currentUserType !== '') {
    return CommonLoginComponent
  }
  return SelectUserType
}

export default Login

import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Input, Button, Form } from 'antd'
import { Link, useLocation, Redirect } from 'react-router-dom'
import Fade from 'reactstrap/lib/Fade'
import LogoWithDescription from 'components/Public/Logo/LogoWithDescription'
import { USER_TYPE_ENUM, USER_TYPE_STRING } from 'constants/constants'

const Login = () => {
  const user = useSelector(state => state.user)
  const dispatch = useDispatch()
  const { pathname } = useLocation()
  const loginUserType = RegExp('admin').test(pathname) ? USER_TYPE_ENUM.ADMIN : ''
  const [currentUserType, setCurrentUserType] = useState(loginUserType)
  const isStudent = currentUserType === USER_TYPE_ENUM.STUDENT

  if (user.authorized) {
    switch (user.userTypeEnum) {
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
    values.isStudent = isStudent
    dispatch({
      type: 'user/LOGIN',
      payload: values,
    })
  }

  const onFinishFailed = errorInfo => {
    console.log('Failed:', errorInfo)
  }

  const SelectUserType = (
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

  const LoginForm = () => {
    return (
      <Fade>
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
              initialValues={{ email: currentUserType.toLowerCase(), password: 'demo123' }}
            >
              <Form.Item
                name="email"
                rules={[{ required: true, message: 'Please input your e-mail address' }]}
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
      </Fade>
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
  )

  if (currentUserType !== '') {
    return CommonLoginComponent
  }
  return SelectUserType
}

export default Login

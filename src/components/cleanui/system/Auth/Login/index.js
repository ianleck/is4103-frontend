import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Input, Button, Form } from 'antd'
import { Link, useLocation, Redirect } from 'react-router-dom'
import LogoWithDescription from '../../../../Public/Logo/LogoWithDescription'
import { userTypeEnum, userTypeString } from '../../../../../constants'

const Login = () => {
  const user = useSelector(state => state.user)
  const dispatch = useDispatch()
  const { pathname } = useLocation()
  const loginUserType = RegExp('admin').test(pathname) ? userTypeEnum.admin : ''
  const [currentUserType, setCurrentUserType] = useState(loginUserType)

  if (user.authorized) {
    switch (user.userTypeEnum) {
      case userTypeEnum.admin:
        return <Redirect to="/admin" />
      case userTypeEnum.sensei:
        return <Redirect to="/sensei" />
      case userTypeEnum.student:
        return <Redirect to="/" />
      default:
        return <Redirect to="/" />
    }
  }

  const onFinish = values => {
    values.isStudent = currentUserType === userTypeEnum.student
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
            onClick={() => setCurrentUserType(userTypeEnum.sensei)}
            className="text-center"
          >
            <i className="fa fa-graduation-cap" />
            &nbsp;&nbsp;Login as a {userTypeString.sensei}
          </Button>
        </div>
        <div className="col-12 col-md-4 mt-3 mt-md-0">
          <Button
            block
            type="primary"
            size="large"
            onClick={() => setCurrentUserType(userTypeEnum.student)}
            className="text-center"
          >
            <i className="fa fa-user" />
            &nbsp;&nbsp;Login as a {userTypeString.student}
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
          currentUserType === userTypeEnum.student
            ? setCurrentUserType(userTypeEnum.sensei)
            : setCurrentUserType(userTypeEnum.student)
        }
      >
        <span>
          Login as{' '}
          {currentUserType === userTypeEnum.student
            ? userTypeString.sensei
            : userTypeString.student}
        </span>
      </Button>
    )
  }

  const LoginForm = () => {
    return (
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
    )
  }

  const AdminLoginComponent = (
    <div className="container">
      <div className="row justify-content-between align-items-center">
        <div className="col-12 col-md-6 text-center">{LogoWithDescription}</div>
        <div className="col-12 col-md-6 mt-3 mt-md-0">
          <div className="card">
            <div className="card-body">
              <div className="text-dark text-center font-size-24 mb-3">
                <strong>
                  {userTypeString.admin}
                  &nbsp;Portal
                </strong>
              </div>
              <LoginForm />
              <div className="text-center">
                <Link to="/auth/forgot-password" className="kit__utils__link font-size-16">
                  Forgot Password?
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )

  const LoginComponent = (
    <div className="container">
      {SelectUserType}
      <div className="row justify-content-between align-items-center">
        <div className="col-12 col-md-6 text-center">{LogoWithDescription}</div>
        <div className="col-12 col-md-6 mt-3 mt-md-0">
          <div className="card">
            <div className="card-body">
              <div className="text-dark text-center font-size-24 mb-3">
                <strong>
                  {currentUserType === userTypeEnum.student
                    ? userTypeString.student
                    : userTypeString.sensei}
                  &nbsp;Portal
                </strong>
              </div>
              <LoginForm />
              <div className="text-center">
                <Link to="/auth/forgot-password" className="kit__utils__link font-size-16">
                  Forgot Password?
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="text-center pt-2 mb-auto">
        <div className="text-center mt-3 mb-3">
          <SwitchUserTypeButton />
        </div>
        <span className="mr-2">Don&#39;t have an account?</span>
        <Link to="/auth/register" className="kit__utils__link font-size-16">
          Sign up
        </Link>
      </div>
    </div>
  )

  if (currentUserType === userTypeEnum.admin) {
    return AdminLoginComponent
  }
  if (currentUserType !== '') {
    return LoginComponent
  }
  return SelectUserType
}

export default Login

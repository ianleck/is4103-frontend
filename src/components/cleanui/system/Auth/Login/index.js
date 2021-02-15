import React from 'react'
import { connect } from 'react-redux'
import { Input, Button, Radio, Form, Tooltip } from 'antd'
import { Link } from 'react-router-dom'
import style from '../style.module.scss'

const mapStateToProps = ({ user, settings, dispatch }) => ({
  dispatch,
  user,
  authProvider: settings.authProvider,
  logo: settings.logo,
})

const Login = ({ dispatch, user, authProvider, logo }) => {
  const onFinish = values => {
    dispatch({
      type: 'user/LOGIN',
      payload: values,
    })
  }

  const onFinishFailed = errorInfo => {
    console.log('Failed:', errorInfo)
  }

  const changeAuthProvider = value => {
    dispatch({
      type: 'settings/CHANGE_SETTING',
      payload: {
        setting: 'authProvider',
        value,
      },
    })
  }

  return (
    <div>
      <div className="text-center mb-5">
        <h1 className="mb-5 px-3">
          <strong>Welcome to {logo}</strong>
        </h1>
        <p>
          Admin Account - <strong>admin</strong> / <strong>demo123</strong>
          <br />
          Sensei Account - <strong>sensei</strong> / <strong>demo123</strong>
          <br />
          Student Account - <strong>student</strong> / <strong>demo123</strong>
          <br />
        </p>
      </div>
      <div className={`card ${style.container}`}>
        <div className="text-dark font-size-24 mb-3">
          <strong>Sign in to your account using JWT</strong>
        </div>
        <div className="mb-4">
          <Radio.Group onChange={e => changeAuthProvider(e.target.value)} value={authProvider}>
            <Radio disabled value="firebase">
              Firebase
            </Radio>
            <Radio value="jwt">JWT</Radio>
            <Tooltip title="Read Docs Guide">
              <Radio value="Auth0" disabled>
                Auth0
              </Radio>
            </Tooltip>
            <Tooltip title="Read Docs Guide">
              <Radio value="Strapi" disabled>
                Strapi
              </Radio>
            </Tooltip>
          </Radio.Group>
        </div>
        <Form
          layout="vertical"
          hideRequiredMark
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
          className="mb-4"
          initialValues={{ email: 'admin', password: 'demo123' }}
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
            <strong>Sign in</strong>
          </Button>
        </Form>
        <Link to="/auth/forgot-password" className="kit__utils__link font-size-16">
          Forgot Password?
        </Link>
      </div>
      <div className="text-center pt-2 mb-auto">
        <span className="mr-2">Don&#39;t have an account?</span>
        <Link to="/auth/register" className="kit__utils__link font-size-16">
          Sign up
        </Link>
      </div>
    </div>
  )
}

export default connect(mapStateToProps)(Login)

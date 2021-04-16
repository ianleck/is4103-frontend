import React from 'react'
import { useSelector } from 'react-redux'
import { USER_TYPE_ENUM } from 'constants/constants'
import { useHistory } from 'react-router-dom'
import { MessageOutlined } from '@ant-design/icons'
import { Button } from 'antd'
import style from './style.module.scss'

const ChatAction = () => {
  const user = useSelector(state => state.user)
  const history = useHistory()

  const goToChat = () => {
    if (user.userType === USER_TYPE_ENUM.STUDENT) {
      const path = '/student/dashboard/messages'
      history.push(path)
    } else if (user.userType === USER_TYPE_ENUM.SENSEI) {
      const path = '/sensei/messages'
      history.push(path)
    }
  }

  return (
    <Button
      ghost
      size="large"
      className="border-0"
      onClick={() => goToChat()}
      icon={<MessageOutlined className={style.icon} />}
    />
  )
}

export default ChatAction

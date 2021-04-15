import { MessageOutlined } from '@ant-design/icons'
import { Button } from 'antd'
import React from 'react'
import style from './style.module.scss'

const ChatAction = () => {
  return (
    <Button
      ghost
      size="large"
      className="border-0"
      icon={<MessageOutlined className={style.icon} />}
    />
  )
}

export default ChatAction

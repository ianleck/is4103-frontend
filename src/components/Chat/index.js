import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { MessageOutlined, PlusOutlined, SendOutlined } from '@ant-design/icons'
import { Avatar, Button, Input, List, Space } from 'antd'
import { getChats, sendMessage } from 'services/chat'
import { isNil, map } from 'lodash'
import { getUserFullName, showNotification } from 'components/utils'
import { CHAT_EMPTY_MSG, WARNING } from 'constants/notifications'

const { Search } = Input

const ChatComponent = () => {
  const user = useSelector(state => state.user)

  const [chatList, setChatList] = useState()
  const [selectedChat, setSelectedChat] = useState() // Entire Selected Chat
  const [selectedMsgs, setSelectedMsgs] = useState() // Track Sorted Array of Msgs within selected

  const [inputMsg, setInputMsg] = useState()

  const retrieveChatList = async () => {
    const response = await getChats(user.accountId)

    if (response && !isNil(response.chatList)) {
      const list = response.chatList
      setChatList(list)
    }
  }

  const refreshChatList = async () => {
    const response = await getChats(user.accountId)

    if (response && !isNil(response.chatList)) {
      setChatList(response.chatList)
    }
  }

  const populateChatListCard = item => {
    return (
      <div
        role="button"
        tabIndex={0}
        className="btn border-0 text-left w-100 mt-4"
        onClick={() => selectChat(item)}
        onKeyDown={event => event.preventDefault()}
      >
        <div className="row align-items-center">
          <div className="col-auto pl-2">
            <Avatar size={64} src={getAvatar(item)} />
          </div>
          <div className="col pl-2">
            <h5 className="truncate-2-overflow text-wrap font-weight-bold">{getChatName(item)}</h5>
            <div className="truncate-2-overflow text-wrap text-muted">{getLatestMsg(item)}</div>
          </div>
        </div>
      </div>
    )
  }

  const getAvatar = item => {
    if (item.isChatGroup) {
      return '/resources/images/groupchatIcon.png'
    }
    return '/resources/images/avatars/avatar-2.png'
  }

  const getChatName = item => {
    const msg = item.Messages[0]

    if (msg.senderId === user.accountId) {
      const secondUser = msg.Receiver
      return getUserFullName(secondUser)
    }

    const secondUser = msg.Sender
    return getUserFullName(secondUser)
  }

  const getLatestMsg = item => {
    const lastIdx = item.Messages.length - 1
    const messages = item.Messages
    const sortedMessages = sortMsg(messages)

    const msg = sortedMessages[lastIdx]
    const body = msg.messageBody

    if (msg.senderId === user.accountId) {
      return `You: ${body}`
    }

    const sender = getUserFullName(msg.Sender)
    return `${sender}: ${body}`
  }

  const selectChat = record => {
    refreshChatList()
    setSelectedChat(record)
    populateSelectedMsg(record)
  }

  const populateSelectedMsg = record => {
    const sortedMessages = sortMsg(record.Messages)
    setSelectedMsgs(sortedMessages)
  }

  const noChatSelected = () => {
    return (
      <div className="container h-100 text-center align-bottom mt-4">
        <MessageOutlined /> Select a chat to populate messages...
      </div>
    )
  }

  const sortMsg = objArr => {
    return objArr.sort((a, b) => new Date(a.updatedAt).getTime() - new Date(b.updatedAt).getTime())
  }

  const displayMessages = sortedMessages => {
    return populateMessageBubbles(sortedMessages)
  }

  const populateMessageBubbles = sortedMessages => {
    return <div className="row">{map(sortedMessages, msg => chatBubble(msg))}</div>
  }

  const chatBubble = msg => {
    const body = msg.messageBody

    if (msg.senderId === user.accountId) {
      return (
        <div key={msg.messageId} className="col-12">
          <div className="mytalk-bubble round float-right">
            <div>{body}</div>
          </div>
        </div>
      )
    }

    return (
      <div key={msg.messageId} className="col-12">
        <div className="talk-bubble round">
          <div>{body}</div>
        </div>
      </div>
    )
  }

  const handleChange = e => {
    const words = e.target.value
    setInputMsg(words)
  }

  const onSend = () => {
    if (isNil(inputMsg)) {
      showNotification('warn', WARNING, CHAT_EMPTY_MSG)
    } else {
      // Have not considered Group Chat
      sendPM()
    }
  }

  const sendPM = async () => {
    let receiverId = selectedChat.accountId1

    if (user.accountId === selectedChat.accountId1) {
      receiverId = selectedChat.accountId2
    }

    const fakeAddition = { senderId: user.accountId, messageBody: inputMsg }
    const msgList = [...selectedMsgs, fakeAddition]

    const payload = { messageBody: inputMsg }
    const response = await sendMessage(receiverId, payload)

    if (response) {
      refreshChatList()
      setInputMsg()
      setSelectedMsgs(msgList)
    }
  }

  useEffect(() => {
    retrieveChatList()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div className="row">
      <div className="col-12">
        <div className="card">
          <div className="card-header">
            <div className="row justify-content-between align-items-center">
              <div className="col-12 col-sm-auto text-center text-sm-left">
                <h5 className="mb-0">Chat</h5>
              </div>
              <div className="col-12 col-sm-auto mt-3 mt-sm-0 text-center text-sm-right">
                <Space>
                  <Button type="primary" size="large" shape="round" icon={<PlusOutlined />}>
                    New Chat
                  </Button>
                  <Button type="primary" size="large" shape="round" icon={<PlusOutlined />}>
                    Create New Chat Group
                  </Button>
                </Space>
              </div>
            </div>
          </div>

          <div className="card-body">
            <div className="row">
              <div className="col-12 col-md-4 chat-list-card overflow-y-scroll m-0 p-0">
                <List
                  itemLayout="horizontal"
                  dataSource={chatList}
                  renderItem={item => <List.Item>{populateChatListCard(item)}</List.Item>}
                />
              </div>

              <div className="col-12 col-md-8">
                <div className="message-list-card overflow-y-scroll card pb-0 mb-0">
                  {selectedChat ? displayMessages(selectedMsgs) : noChatSelected()}
                </div>
                <div className="m-0 p-0">
                  <Search
                    placeholder="Write your Message"
                    value={inputMsg}
                    disabled={isNil(selectedChat)}
                    enterButton={<SendOutlined />}
                    size="large"
                    onChange={e => handleChange(e)}
                    onSearch={onSend}
                    onSubmit={onSend}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ChatComponent

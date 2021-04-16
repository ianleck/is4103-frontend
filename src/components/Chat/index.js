import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import {
  FireOutlined,
  MessageOutlined,
  PlusOutlined,
  QuestionCircleOutlined,
  SendOutlined,
  TeamOutlined,
} from '@ant-design/icons'
import { Avatar, Button, Input, List, Modal, Space, Form, Select, Divider, Popconfirm } from 'antd'
import {
  getChats,
  sendMessage,
  sendGroupMessage,
  createChatGroup,
  deleteChatGroup,
  addChatGroupMember,
} from 'services/chat'
import { useDebounce } from 'use-debounce'
import searchByFilter from 'services/search'
import { isEmpty, isNil, map, size } from 'lodash'
import { getUserFullName, showNotification } from 'components/utils'
import {
  CHAT_EMPTY_MSG,
  ERROR,
  WARNING,
  CHAT_ALR_EXIST,
  SUCCESS,
  NEW_CHAT_CREATED,
  NEW_CHAT_GROUP_CREATED,
  CHAT_MEMBERS_ADDED,
} from 'constants/notifications'
import { DEFAULT_TIMEOUT } from 'constants/constants'

const { Search } = Input
const { Option } = Select

const ChatComponent = () => {
  const user = useSelector(state => state.user)

  const [chatList, setChatList] = useState()
  const [selectedChat, setSelectedChat] = useState() // Entire Selected Chat
  const [selectedMsgs, setSelectedMsgs] = useState() // Track Sorted Array of Msgs within selected

  const [inputMsg, setInputMsg] = useState()

  const [showNewChat, setShowNewChat] = useState(false)
  const [searchText, setSearchText] = useState('')
  const [query] = useDebounce(searchText, 750)
  const [userResults, setUserResults] = useState([])
  const [isLoading, setIsLoading] = useState(false)

  const [showNewChatGroup, setShowNewChatGroup] = useState(false)

  const [isGroupChatSelected, setIsGroupChatSelected] = useState(false)

  const [showMembersManagementModal, setShowMembersManagementModal] = useState(false)

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
    if (item.isChatGroup) {
      return item.nameOfGroup
    }

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

    if (isEmpty(messages)) {
      return 'No Messages'
    }

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
    setIsGroupChatSelected(record.isChatGroup)
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
      if (isGroupChatSelected) {
        sendGrpMsg()
      }

      if (!isGroupChatSelected) {
        sendPM()
      }
    }
  }

  const sendGrpMsg = async () => {
    const cId = selectedChat.chatId

    const fakeAddition = { senderId: user.accountId, messageBody: inputMsg }
    const msgList = [...selectedMsgs, fakeAddition]

    const payload = { messageBody: inputMsg }
    const response = await sendGroupMessage(cId, payload)

    if (response) {
      refreshChatList()
      setInputMsg()
      setSelectedMsgs(msgList)
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

  const addNewChatFooter = (
    <div className="row justify-content-between">
      <div className="col-auto">
        <Button type="default" size="large" onClick={() => setShowNewChat(false)}>
          Cancel
        </Button>
      </div>
      <div className="col-auto">
        <Button type="primary" form="newChatForm" htmlType="submit" size="large">
          Send Message
        </Button>
      </div>
    </div>
  )

  const onFinishFailed = errorInfo => {
    console.log('Failed:', errorInfo)
  }

  const onNewChat = async values => {
    const receiverId = values.id
    const body = values.msg

    if (checkIfChatExists(receiverId)) {
      setSearchText('')
      setShowNewChat(false)
      showNotification('error', ERROR, CHAT_ALR_EXIST)
    } else {
      const payload = { messageBody: body }
      const response = await sendMessage(receiverId, payload)

      if (response) {
        refreshChatList()
        setSearchText('')
        setInputMsg()
        setShowNewChat(false)
        showNotification('success', SUCCESS, NEW_CHAT_CREATED)
      }
    }
  }

  const checkIfChatExists = id => {
    for (let i = 0; i < chatList.length; i += 1) {
      if (chatList[i].accountId1 === id) {
        return true
      }
      if (!isNil(chatList[i].accountId2) && chatList[i].accountId2 === id) {
        return true
      }
    }
    return false
  }

  const handleSearch = e => {
    const nameSearch = e.target.value

    if (!isEmpty(nameSearch)) {
      setSearchText(nameSearch)
    }
  }

  const searchByFilterSvc = async () => {
    setIsLoading(true)
    const response = await searchByFilter(query)

    if (response && !isNil(response.success)) {
      if (!isNil(response.users)) setUserResults(response.users)
    }
    setTimeout(() => {
      setIsLoading(false)
    }, DEFAULT_TIMEOUT)
  }

  const addNewChatGroupFooter = (
    <div className="row justify-content-between">
      <div className="col-auto">
        <Button type="default" size="large" onClick={() => setShowNewChatGroup(false)}>
          Cancel
        </Button>
      </div>
      <div className="col-auto">
        <Button type="primary" form="newChatGroupForm" htmlType="submit" size="large">
          Create Chat Group
        </Button>
      </div>
    </div>
  )

  const onNewChatGrp = async values => {
    const gName = values.grpName
    const payload = { name: gName }

    const response = await createChatGroup(payload)

    if (response) {
      refreshChatList()
      setShowNewChatGroup(false)
      showNotification('success', SUCCESS, NEW_CHAT_GROUP_CREATED)
    }
  }

  const onDeleteGroup = async () => {
    const grpId = selectedChat.chatId

    const response = await deleteChatGroup(grpId)

    if (response) {
      setSelectedChat()
      setSelectedMsgs()
      setIsGroupChatSelected(false)
      refreshChatList()
      showNotification('success', SUCCESS, NEW_CHAT_GROUP_CREATED)
    }
  }

  const membersManagementFooter = (
    <div className="row justify-content-between">
      <div className="col-auto">
        <Button type="default" size="large" onClick={() => setShowMembersManagementModal(false)}>
          Cancel
        </Button>
      </div>
      <div className="col-auto">
        <Button type="primary" form="addMemberForm" htmlType="submit" size="large">
          Add new Member
        </Button>
      </div>
    </div>
  )

  const onAddMember = async values => {
    const grpId = selectedChat.chatId
    const userId = values.id

    const response = await addChatGroupMember(grpId, userId)

    if (response) {
      refreshChatList()
      setSearchText('')
      setInputMsg()
      setShowMembersManagementModal(false)
      showNotification('success', SUCCESS, CHAT_MEMBERS_ADDED)
    }
  }

  useEffect(() => {
    retrieveChatList()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    if (!isEmpty(query)) searchByFilterSvc(query)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query])

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
                  <Button
                    type="primary"
                    size="large"
                    shape="round"
                    onClick={() => setShowNewChat(true)}
                    icon={<PlusOutlined />}
                  >
                    New Chat
                  </Button>
                  <Button
                    type="primary"
                    size="large"
                    shape="round"
                    onClick={() => setShowNewChatGroup(true)}
                    icon={<PlusOutlined />}
                  >
                    Create New Chat Group
                  </Button>
                  {isGroupChatSelected ? (
                    <Button
                      type="primary"
                      size="large"
                      shape="round"
                      onClick={() => setShowMembersManagementModal(true)}
                      icon={<TeamOutlined />}
                    >
                      Members Management
                    </Button>
                  ) : null}
                  {isGroupChatSelected ? (
                    <Popconfirm
                      title="Are you sure you wish to delete this group?"
                      icon={<QuestionCircleOutlined className="text-danger" />}
                      onConfirm={() => onDeleteGroup()}
                    >
                      <Button type="danger" size="large" shape="round" icon={<FireOutlined />}>
                        Delete Chat Group
                      </Button>
                    </Popconfirm>
                  ) : null}
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

      <Modal
        visible={showNewChat}
        title="New Chat"
        cancelText="Close"
        centered
        onCancel={() => setShowNewChat(false)}
        footer={addNewChatFooter}
      >
        <p>
          To chat with a new user, search for the user using their name in the first input box and
          confirm the user that you want to chat with via the dropdown
        </p>

        <Search
          name="message"
          placeholder="Search for a user..."
          className="message-input mt-2"
          onChange={e => handleSearch(e)}
        />

        <div className="row mt-2">
          <small className="col-12">{`${size(userResults)} users found`}</small>
          <small className="col-12">
            Select the user you want to chat with in the dropdown below
          </small>
        </div>
        <Divider />

        <Form
          id="newChatForm"
          layout="vertical"
          hideRequiredMark
          onSubmit={e => e.preventDefault()}
          onFinish={onNewChat}
          onFinishFailed={onFinishFailed}
        >
          <Form.Item
            label="Select User From Search Result"
            name="id"
            rules={[{ required: true, message: 'Please search for a user.' }]}
          >
            <Select disabled={isLoading} showSearch onSearch={handleSearch}>
              {map(userResults, u => {
                return (
                  <Option value={u.accountId} key={u.accountId}>
                    {u.firstName} {u.lastName}
                  </Option>
                )
              })}
            </Select>
          </Form.Item>
          <Form.Item
            label="Write Your Message"
            name="msg"
            rules={[{ required: true, message: 'Please write a message to the selected user.' }]}
          >
            <Input />
          </Form.Item>
        </Form>
      </Modal>

      <Modal
        visible={showMembersManagementModal}
        title="Members Management"
        cancelText="Close"
        centered
        onCancel={() => setShowMembersManagementModal(false)}
        footer={membersManagementFooter}
      >
        <p>
          To Add a new user, search for the user using their name in the first input box and confirm
          the user that you want to add with via the dropdown
        </p>

        <Search
          name="message"
          placeholder="Search for a user..."
          className="message-input mt-2"
          onChange={e => handleSearch(e)}
        />

        <div className="row mt-2">
          <small className="col-12">{`${size(userResults)} users found`}</small>
          <small className="col-12">
            Select the user you want to add with in the dropdown below
          </small>
        </div>
        <Divider />

        <Form
          id="addMemberForm"
          layout="vertical"
          hideRequiredMark
          onSubmit={e => e.preventDefault()}
          onFinish={onAddMember}
          onFinishFailed={onFinishFailed}
        >
          <Form.Item
            label="Select User From Search Result"
            name="id"
            rules={[{ required: true, message: 'Please search for a user.' }]}
          >
            <Select disabled={isLoading} showSearch onSearch={handleSearch}>
              {map(userResults, u => {
                return (
                  <Option value={u.accountId} key={u.accountId}>
                    {u.firstName} {u.lastName}
                  </Option>
                )
              })}
            </Select>
          </Form.Item>
        </Form>
      </Modal>

      <Modal
        visible={showNewChatGroup}
        title="New Chat Group"
        cancelText="Close"
        centered
        onCancel={() => setShowNewChatGroup(false)}
        footer={addNewChatGroupFooter}
      >
        <Form
          id="newChatGroupForm"
          layout="vertical"
          hideRequiredMark
          onSubmit={e => e.preventDefault()}
          onFinish={onNewChatGrp}
          onFinishFailed={onFinishFailed}
        >
          <Form.Item
            label="Name of new Chat Group"
            name="grpName"
            rules={[{ required: true, message: 'Please input name for the new chat group.' }]}
          >
            <Input />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  )
}

export default ChatComponent

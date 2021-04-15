import React, { useState, useRef, useEffect } from 'react'
import { useSelector } from 'react-redux'

import { Button, notification } from 'antd'
import io from 'socket.io-client'
import Peer from 'simple-peer'
import { useParams } from 'react-router-dom'
import apiClient from 'services/axios'
import { SOCKET_API, BACKEND_API } from '../../../constants/constants'
import UserVid from './UserVideo'
import CallButtons from './CallButtons'
// const consultationData = {
//   studentId: 'studentId',
//   senseiId: 'senseiId',
// }

const Video = () => {
  const [yourID, setYourID] = useState('')
  const [users, setUsers] = useState({})
  const [stream, setStream] = useState()
  const [incomingCall, setIncomingCall] = useState(false)
  const [caller, setCaller] = useState('')
  const [callerSignal, setCallerSignal] = useState()
  const [onCall, setOnCall] = useState(false)
  const [calling, setCalling] = useState(false)
  const [appPeer, setAppPeer] = useState()
  const userVideo = useRef()
  const partnerVideo = useRef()
  const socket = useRef()

  const { consultationId } = useParams()
  const [consultation, setConsultation] = useState({})
  const [userToCall, setUserToCall] = useState()
  const user = useSelector(state => state.user)

  const muted = false
  const getConsultation = async () => {
    const resp = await apiClient
      .get(`${BACKEND_API}/consultation/${consultationId}`)
      .then(response => {
        if (response && response.data) {
          if (response.data.success) return response.data
        }
        return false
      })
      .catch(err => console.log(err))
    if (resp) {
      const currConsultation = resp.consultation
      setConsultation(currConsultation)
      const userIdToCall =
        currConsultation.Student.accountId === user.accountId
          ? currConsultation.Sensei.accountId
          : currConsultation.Student.accountId
      setUserToCall(userIdToCall)
    }
  }

  useEffect(() => {
    getConsultation().then(() => {
      socket.current = io.connect(SOCKET_API)
      // socket.current = io.connect('ws://localhost:5000')
      navigator.mediaDevices
        .getUserMedia({ video: true, audio: true })
        .then(_stream => {
          setStream(_stream)
          if (userVideo.current) {
            userVideo.current.srcObject = _stream
          }
        })
        .catch(err => {
          console.log('media device err= ', err)
        })

      socket.current.emit('init', {
        consultationId,
        accountId: user.accountId,
      })
      socket.current.on('consultationUsers', data => {
        setUsers(data)
      })
      socket.current.on('yourID', id => {
        setYourID(id)
      })
      socket.current.on('allUsers', _users => {
        setUsers(_users)
      })

      socket.current.on('tooManyUsers', () => {
        notification.error({ message: 'There are currently more than two users connected.' })
      })

      socket.current.on('hey', data => {
        setIncomingCall(true)
        setCaller(data.from)
        setCallerSignal(data.signal)
      })

      socket.current.on('callEnded', () => {
        if (appPeer) {
          appPeer.destroy()
        }
        setOnCall(false)
        notification.success({ message: 'Call ended' })
        setAppPeer(null)
        setOnCall(false)
      })
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Calls peer. When peer accepts call, set onCall=true
  const startCall = () => {
    const id = users[userToCall]
    const peer = new Peer({
      initiator: true,
      trickle: false,
      config: {
        iceServers: [
          {
            urls: 'stun:numb.viagenie.ca',
            username: 'sultan1640@gmail.com',
            credential: '98376683',
          },
          {
            urls: 'turn:188.166.248.164:3478',
            username: 'kengthong',
            credential: 'password',
          },
        ],
      },
      stream,
    })

    peer.on('signal', data => {
      if (data.renegotiate || data.transceiverRequest) return
      socket.current.emit('callUser', { userToCall: id, signalData: data, from: yourID })
      setCalling(true)
    })

    peer.on('stream', _stream => {
      if (partnerVideo.current) {
        partnerVideo.current.srcObject = _stream
      }
    })

    socket.current.on('callAccepted', signal => {
      setOnCall(true)
      setCalling(false)
      peer.signal(signal)
    })

    setAppPeer(peer)
  }

  // Accepts incoming call. When peer accepts call, set onCall=true, incomingCall = false
  const acceptCall = () => {
    setOnCall(true)
    setIncomingCall(false)
    const peer = new Peer({
      initiator: false,
      trickle: false,
      stream,
    })
    peer.on('signal', data => {
      socket.current.emit('acceptCall', { signal: data, to: caller })
    })

    peer.on('stream', _stream => {
      partnerVideo.current.srcObject = _stream
      setIncomingCall(false)
      setOnCall(true)
    })

    peer.signal(callerSignal)
    setAppPeer(peer)
  }

  const endCall = () => {
    if (appPeer) {
      socket.current.emit('endCall', { consultationId })
    }
  }

  let PartnerVideo
  if (onCall) {
    PartnerVideo = (
      // eslint-disable-next-line jsx-a11y/media-has-caption
      <video
        style={{ border: '1px solid blue', width: '100%', height: '600px' }}
        playsInline
        muted={muted}
        ref={partnerVideo}
        autoPlay
      />
    )
  }

  return (
    <div
      style={{
        height: '100%',
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <div
        className="d-flex no-gutters"
        style={{
          minHeight: '600px',
          widtH: '100%',
        }}
      >
        <div
          className="col-lg-8 col-8"
          style={{
            position: 'relative',
            height: '600px',
            width: '100%',
            border: '1px solid #e8e8e8',
          }}
        >
          <UserVid stream={stream} minimize={onCall} muted />
          {PartnerVideo}
          <CallButtons
            onCall={onCall}
            incomingCall={incomingCall}
            userToCallIsOnline={users[userToCall]}
            endCall={endCall}
            calling={calling}
            startCall={startCall}
            acceptCall={acceptCall}
          />
        </div>
        <div className="col-4 col-lg-4 d-flex flex-column" style={{ border: '1px solid #e8e8e8' }}>
          <div className="col-5 col-lg-4 col-md-4">{consultation.title}</div>
          <div>NOTES</div>
        </div>
      </div>
      <div style={{ display: 'flex', width: '100%' }}>
        {Object.keys(users).map(key => {
          if (key === yourID) {
            return null
          }
          return <Button onClick={() => startCall(key)}>Call {key}</Button>
        })}
      </div>
      <Button onClick={() => setOnCall(!onCall)}> Minimize </Button>
      <div style={{ display: 'flex', width: '100%' }}>{incomingCall}</div>
    </div>
  )
}

export default Video
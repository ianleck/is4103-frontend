import { PhoneOutlined } from '@ant-design/icons'
import { Badge, Button } from 'antd'
import React from 'react'

/**
 * Has five types of button
 * 1. Start call
 * 2. Start call (disabled, because opp party is not online)
 * 3. Calling
 * 4. Accept call
 * 5. End call
 *
 * States: onCall, incomingCall, userToCallIsOnline,
 * To start call: onCall = false, incomingCall = false, userToCallIsOnline = true
 * To accept a call: onCall = false, incomingCall = true, userToCallIsOnline = true
 * To be in a call and to end call: onCall= true, incomingCall = false, userToCallIsOnline = true
 */
const CallButtons = ({
  onCall,
  calling,
  endCall,
  startCall,
  userToCallIsOnline,
  incomingCall,
  acceptCall,
}) => {
  const renderButton = () => {
    let customButton
    if (userToCallIsOnline) {
      if (!onCall && !incomingCall && !calling) {
        // start call
        customButton = (
          <Button
            shape="round"
            style={{
              color: 'white',
              border: '#069c06',
              backgroundColor: '#069c06',
              fontSize: '16px',
            }}
            onClick={() => startCall()}
          >
            <PhoneOutlined /> Start Call
          </Button>
        )
      } else if (!onCall && !incomingCall && calling) {
        customButton = (
          <Button
            shape="round"
            style={{
              fontSize: '16px',
            }}
          >
            <Badge status="processing" text="Calling..." />
          </Button>
        )
      } else if (!onCall && incomingCall) {
        // accept incoming call
        customButton = (
          <Button
            shape="round"
            style={{
              fontSize: '16px',
            }}
            onClick={() => acceptCall()}
          >
            <PhoneOutlined /> Accept Incoming Call
          </Button>
        )
      } else if (onCall && !incomingCall) {
        // end call
        customButton = (
          <Button
            type="danger"
            shape="round"
            style={{ fontSize: '16px' }}
            onClick={() => endCall()}
          >
            Endcall
          </Button>
        )
      }
    } else {
      // start call (disabled)
      customButton = (
        <Button shape="round" disabled>
          <PhoneOutlined /> Start Call
        </Button>
      )
    }

    return customButton
  }
  return (
    <div
      style={{
        position: 'absolute',
        bottom: '20px',
        marginLeft: 'auto',
        marginRight: 'auto',
        left: 0,
        right: 0,
        display: 'flex',
        justifyContent: 'center',
      }}
    >
      {renderButton()}
    </div>
  )
}

export default CallButtons

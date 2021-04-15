/* eslint-disable jsx-a11y/media-has-caption */
import React, { useRef, useEffect } from 'react'

const UserVideo = ({ stream, muted, minimize }) => {
  const userVid = useRef()
  const video = false
  const sizes = {
    minimized: {
      container: {
        height: '180px',
        width: '150px',
        position: 'absolute',
        top: '0px',
        right: '40px',
      },
      video: {
        height: '100%',
        width: '100%',
        border: '1px solid #e8e8e8',
      },
    },
    maximized: {
      container: {
        height: '100%',
        width: '100%',
        position: 'absolute',
      },
      video: {
        height: '100%',
        width: '100%',
      },
    },
  }
  useEffect(() => {
    if (video) {
      userVid.current.srcObject = stream
    }
  }, [stream, video])

  return (
    <div style={minimize ? sizes.minimized.container : sizes.maximized.container}>
      {video ? (
        <video
          style={{ height: '100%', width: '100%' }}
          playsInline
          muted={muted}
          ref={userVid}
          autoPlay
        />
      ) : (
        <div style={minimize ? sizes.minimized.video : sizes.maximized.video}>VIDEO</div>
      )}
    </div>
  )
}

export default UserVideo

import { DownloadOutlined, UploadOutlined } from '@ant-design/icons'
import { Button, Upload, message } from 'antd'
import Axios from 'axios'
import { isNil } from 'lodash'
import React from 'react'
import { useDispatch } from 'react-redux'
import download from 'js-file-download'

const VerifyProfileCard = ({ user, showUploadButton, accessToken }) => {
  const dispatch = useDispatch()
  const useToken = isNil(accessToken) ? user.accessToken : accessToken

  const getUploadProps = isTranscript => {
    return {
      name: 'file',
      action: isTranscript
        ? 'http://localhost:5000/api/upload/transcript'
        : 'http://localhost:5000/api/upload/cv',
      headers: {
        authorization: `Bearer ${user.accessToken}`,
      },
      onChange(info) {
        if (info.file.status !== 'uploading') {
          console.log(info.file, info.fileList)
        }
        if (info.file.status === 'done') {
          message.success(`${info.file.name} file uploaded successfully`)
          dispatch({
            type: 'user/LOAD_CURRENT_ACCOUNT',
          })
        } else if (info.file.status === 'error') {
          message.error(`${info.file.name} file upload failed.`)
        }
      },
    }
  }

  const downloadFile = isTranscript => {
    Axios.get(isTranscript ? user.transcriptUrl : user.cvUrl, {
      headers: {
        authorization: `Bearer ${useToken}`,
      },
      responseType: 'blob', // Important
    }).then(resp => {
      download(
        resp.data,
        isTranscript
          ? `transcript.${user.transcriptUrl.split('.').pop()}`
          : `cv.${user.cvUrl.split('.').pop()}`,
      )
    })
  }

  const UploadFileComponent = data => {
    return (
      <Upload {...getUploadProps(data.isTranscript)}>
        <Button block type="default" size="large" shape="round">
          <UploadOutlined /> Upload
        </Button>
      </Upload>
    )
  }

  const DownloadFileComponent = data => {
    return (
      <Button
        type="primary"
        shape="round"
        icon={<DownloadOutlined />}
        size="large"
        onClick={() => downloadFile(data.isTranscript)}
      >
        Download
      </Button>
    )
  }

  return (
    <div className="card text-dark">
      <div className="card-header pb-1">
        <div className="row align-items-center justify-content-between mb-2">
          <div className="col-auto">
            <span className="h3 font-weight-bold text-dark">Supporting Documents</span>
          </div>
        </div>
      </div>
      <div className="card-body">
        <div className="row align-items-center">
          <div className="col-12 col-md-4">
            <span className="h4">Transcript</span>
          </div>
          <div className="col-auto mt-2 mt-sm-0">
            {!!showUploadButton && <UploadFileComponent isTranscript />}
          </div>
          <div className="col-auto">
            {user.transcriptUrl !== '' && !isNil(user.transcriptUrl) && (
              <DownloadFileComponent isTranscript />
            )}
          </div>
        </div>
        <div className="row align-items-center mt-4">
          <div className="col-12 col-md-4">
            <span className="h4">CV</span>
          </div>
          <div className="col-auto mt-2 mt-sm-0">
            {!!showUploadButton && <UploadFileComponent isTranscript={false} />}
          </div>
          <div className="col-auto">
            {user.cvUrl !== '' && !isNil(user.cvUrl) && (
              <DownloadFileComponent isTranscript={false} />
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default VerifyProfileCard

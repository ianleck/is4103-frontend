import React from 'react'
import { useSelector } from 'react-redux'
import { Button } from 'antd'
import { DOWNLOAD_LESSON_FILES, SHOW_ASSESSMENT_VID, SHOW_LESSON_VID } from 'constants/text'
import { BookOutlined, ContainerOutlined, DownloadOutlined } from '@ant-design/icons'
import { isNil } from 'lodash'
import { showNotification } from 'components/utils'
import {
  ERROR,
  LESSON_FILE_DOWNLOAD_ERR,
  ASSESSMENT_VID_ALR_PLAYING,
  LESSON_VID_ALR_PLAYING,
} from 'constants/notifications'
import Axios from 'axios'
import download from 'js-file-download'

const AdditionalContentCard = ({ currentLesson, currentVideoUrl, setCurrentVideoUrl }) => {
  const user = useSelector(state => state.user)

  const downloadFiles = () => {
    if (isNil(currentLesson.lessonFileUrl)) {
      showNotification('error', ERROR, LESSON_FILE_DOWNLOAD_ERR)
      return
    }
    Axios.get(currentLesson.lessonFileUrl, {
      headers: {
        authorization: `Bearer ${user.accessToken}`,
      },
      responseType: 'blob', // Important
    }).then(resp => {
      download(resp.data, `lessonfiles.${currentLesson.lessonFileUrl.split('.').pop()}`)
    })
  }

  const toggleAssessmentVideo = toggle => {
    if (toggle === 'lesson' && currentVideoUrl === currentLesson.videoUrl)
      showNotification('success', LESSON_VID_ALR_PLAYING)
    if (toggle === 'assessment' && currentVideoUrl === currentLesson.assessmentUrl)
      showNotification('success', ASSESSMENT_VID_ALR_PLAYING)
    if (toggle === 'assessment') {
      setCurrentVideoUrl(currentLesson.assessmentUrl)
    } else {
      setCurrentVideoUrl(currentLesson.videoUrl)
    }
  }

  return (
    <div className="card">
      <div className="card-body">
        <div className="row">
          <div className="col-12">
            <Button
              type="link"
              size="large"
              icon={<BookOutlined />}
              className="pl-0"
              disabled={isNil(currentLesson.assessmentUrl)}
              onClick={() => toggleAssessmentVideo('assessment')}
            >
              &nbsp;&nbsp;{SHOW_ASSESSMENT_VID}
            </Button>
            <Button
              type="link"
              size="large"
              icon={<ContainerOutlined />}
              className="pl-0"
              disabled={isNil(currentLesson.videoUrl)}
              onClick={() => toggleAssessmentVideo('lesson')}
            >
              &nbsp;&nbsp;{SHOW_LESSON_VID}
            </Button>
          </div>
          <div className="col-12">
            <Button
              type="link"
              size="large"
              icon={<DownloadOutlined />}
              className="pl-0"
              disabled={isNil(currentLesson.lessonFileUrl)}
              onClick={() => downloadFiles()}
            >
              &nbsp;&nbsp;{DOWNLOAD_LESSON_FILES}
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AdditionalContentCard

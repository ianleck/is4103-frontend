import { CloseOutlined } from '@ant-design/icons'
import { Button, Empty } from 'antd'
import { USER_TYPE_ENUM } from 'constants/constants'
import medalImages from 'constants/hardcode/achievements'
import { senseiAchievementTitles, studentAchievementTitles } from 'constants/information'
import { filter, indexOf, isEmpty, isNil, map } from 'lodash'
import React, { useEffect, useState } from 'react'
import { getAllAchievements, getAllAchievementTypes, generateAchievementPdf } from 'services/user'

const AchievementCard = ({ user }) => {
  const [allAchievements, setAllAchievements] = useState([])
  const [userAchievements, setUserAchievements] = useState([])

  const [selectedAchievement, setSelectedAchievment] = useState('')
  const [showSelectedAchievement, setShowSelectedAchievement] = useState(false)

  const getAchievementsSvc = async () => {
    console.log('user is ', user)
    const achievementsRsp = await getAllAchievementTypes()
    if (achievementsRsp && !isNil(achievementsRsp.achievements)) {
      if (user.userType === USER_TYPE_ENUM.STUDENT) {
        const studentAchievements = filter(achievementsRsp.achievements, a => {
          return indexOf(studentAchievementTitles, a.title) >= 0
        })
        setAllAchievements(studentAchievements)
      }
      if (user.userType === USER_TYPE_ENUM.SENSEI) {
        const senseiAchievements = filter(achievementsRsp.achievements, a => {
          return indexOf(senseiAchievementTitles, a.title) >= 0
        })
        setAllAchievements(senseiAchievements)
      }
    }

    if (user && !isNil(user.accountId)) {
      const userAchievementsRsp = await getAllAchievements(user.accountId)
      if (userAchievementsRsp && !isNil(userAchievementsRsp.achievements)) {
        setUserAchievements(userAchievementsRsp.achievements)
      }
    }
  }

  const showAchievementDetails = achievementId => {
    setShowSelectedAchievement(true)
    const getAchievement = filter(allAchievements, ['achievementId', achievementId])
    if (!isEmpty(getAchievement)) {
      const achievementToView = getAchievement[0]
      const checkUserAchievement = filter(userAchievements, ['achievementId', achievementId])
      if (!isEmpty(checkUserAchievement)) {
        achievementToView.currentCount = checkUserAchievement[0].currentCount
      }
      setSelectedAchievment(achievementToView)
    }
  }

  const viewCert = () => {
    generateAchievementPdf(user.accountId)
      .then(response => {
        const file = new Blob([response.data], { type: 'application/pdf' })
        // Build a URL from the file
        const fileURL = URL.createObjectURL(file)
        // Open the URL on new Window
        const pdfWindow = window.open()
        pdfWindow.location.href = fileURL
      })
      .catch(err => console.log(err))
  }

  useEffect(() => {
    getAchievementsSvc()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const AchievementItems = () => {
    if (!isEmpty(allAchievements)) {
      return map(allAchievements, achievement => {
        const userMatch = filter(userAchievements, ['achievementId', achievement.achievementId])

        if (!isEmpty(userMatch)) {
          if (!isNil(userMatch[0].medal)) {
            return (
              <div
                role="button"
                tabIndex={0}
                key={achievement.achievementId}
                className={`${
                  showSelectedAchievement ? 'col-6' : 'col-6 col-lg-4 col-xl-3'
                } p-4 text-center btn border-0`}
                onClick={() => showAchievementDetails(achievement.achievementId)}
                onKeyDown={e => e.preventDefault()}
              >
                <img
                  src={medalImages[userMatch[0].medal]}
                  width={64}
                  className="mb-2"
                  alt="Medal"
                />
                <br />
                <span className="font-weight-bold">{achievement.title}</span>
              </div>
            )
          }
        }

        return (
          <div
            role="button"
            tabIndex={0}
            key={achievement.achievementId}
            className={`${
              showSelectedAchievement ? 'col-6' : 'col-6 col-lg-4 col-xl-3'
            } p-4 text-center btn border-0`}
            onClick={() => showAchievementDetails(achievement.achievementId)}
            onKeyDown={e => e.preventDefault()}
          >
            <img src={medalImages.NIL} width={64} className="mb-2" alt="Medal" />
            <br />
            <span className="font-weight-bold">{achievement.title}</span>
          </div>
        )
      })
    }
    return <Empty />
  }

  return (
    <div className="card">
      <div className="card-header row justify-content-between m-0">
        <div className="h3 mb-0">Achievements</div>
        <Button
          className="text-center text-md-middle button col-12 col-md-5 col-lg-3"
          type="primary"
          onClick={() => viewCert()}
          disabled={isEmpty(userAchievements)}
        >
          View Certificate of Accomplishment
        </Button>
      </div>
      <div className="card-body">
        <div className="row">
          <div className={`${showSelectedAchievement ? 'col-12 col-md-7' : 'col-12'}`}>
            <div className="row text-center">
              <AchievementItems />
            </div>
          </div>
          {showSelectedAchievement && (
            <div className="col-12 col-md-5 align-self-center">
              <div className="row justify-content-end">
                <div className="col-auto">
                  <Button
                    type="default"
                    className="border-0"
                    icon={<CloseOutlined />}
                    onClick={() => setShowSelectedAchievement(false)}
                  />
                </div>
              </div>
              <div className="row p-3">
                <div className="col-12">
                  <h4>{selectedAchievement?.title}</h4>
                  <span>Bronze: {selectedAchievement.bronze}</span>
                  <br />
                  <span>Silver: {selectedAchievement.silver}</span>
                  <br />
                  <span>Gold: {selectedAchievement.gold}</span>
                  <hr />
                  <span>Current count: {selectedAchievement.currentCount || 0}</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default AchievementCard

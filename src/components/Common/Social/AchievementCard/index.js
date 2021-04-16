import { CloseOutlined } from '@ant-design/icons'
import { Button, Empty } from 'antd'
import medalImages from 'constants/hardcode/achievements'
import { filter, isEmpty, isNil, map } from 'lodash'
import React, { useEffect, useState } from 'react'
import { getAllAchievements, getAllAchievementTypes } from 'services/user'

const AchievementCard = ({ user }) => {
  const [allAchievements, setAllAchievements] = useState([])
  const [userAchievements, setUserAchievements] = useState([])

  const [selectedAchievement, setSelectedAchievment] = useState('')
  const [showSelectedAchievement, setShowSelectedAchievement] = useState(false)

  const getAchievementsSvc = async () => {
    const achievementsRsp = await getAllAchievementTypes()
    if (achievementsRsp && !isNil(achievementsRsp.achievements)) {
      setAllAchievements(achievementsRsp.achievements)
    }

    if (user && !isNil(user.accountId)) {
      const userAchievementsRsp = await getAllAchievements(user.accountId)
      console.log(userAchievementsRsp)
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
      <div className="card-header">
        <div className="h3 mb-0">Achievements</div>
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
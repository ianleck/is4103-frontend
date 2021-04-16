import { CloseOutlined } from '@ant-design/icons'
import { Button, Empty } from 'antd'
import medalImages from 'constants/hardcode/achievements'
import { filter, isEmpty, isNil, map } from 'lodash'
import React, { useEffect, useState } from 'react'
import { getAllAchievements, getAllAchievementTypes } from 'services/user'

const AchievementCard = ({ user }) => {
  const [allAchvments, setAllAchvments] = useState([])
  const [userAchvments, setUserAchvments] = useState([])

  const [selectedAchvment, setSelectedAchvment] = useState('')
  const [showSelectedAchvment, setShowSelectedAchvment] = useState(false)

  const getAchievementsSvc = async () => {
    const achievementsRsp = await getAllAchievementTypes()
    console.log(achievementsRsp)
    if (achievementsRsp && !isNil(achievementsRsp.achievements)) {
      setAllAchvments(achievementsRsp.achievements)
    }

    if (user && !isNil(user.accountId)) {
      const userAchievementsRsp = await getAllAchievements(user.accountId)
      console.log(userAchievementsRsp)
      if (userAchievementsRsp && !isNil(userAchievementsRsp.achievements)) {
        setUserAchvments(userAchievementsRsp.achievements)
      }
    }
  }

  const showAchvmentDtls = achievementId => {
    setShowSelectedAchvment(true)
    const getAchievement = filter(allAchvments, ['achievementId', achievementId])
    if (!isEmpty(getAchievement)) {
      const achievementToView = getAchievement[0]
      const checkUserAchvment = filter(userAchvments, ['achievementId', achievementId])
      if (!isEmpty(checkUserAchvment)) {
        achievementToView.currentCount = checkUserAchvment[0].currentCount
      }
      setSelectedAchvment(achievementToView)
    }
  }

  useEffect(() => {
    getAchievementsSvc()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const AchievementItems = () => {
    if (!isEmpty(allAchvments)) {
      return map(allAchvments, achievement => {
        const userMatch = filter(userAchvments, ['achievementId', achievement.achievementId])

        if (!isEmpty(userMatch)) {
          if (!isNil(userMatch[0].medal)) {
            return (
              <div
                role="button"
                tabIndex={0}
                key={achievement.achievementId}
                className={`${
                  showSelectedAchvment ? 'col-6' : 'col-6 col-lg-4 col-xl-3'
                } p-4 text-center btn border-0`}
                onClick={() => showAchvmentDtls(achievement.achievementId)}
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
              showSelectedAchvment ? 'col-6' : 'col-6 col-lg-4 col-xl-3'
            } p-4 text-center btn border-0`}
            onClick={() => showAchvmentDtls(achievement.achievementId)}
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
          <div className={`${showSelectedAchvment ? 'col-12 col-md-7' : 'col-12'}`}>
            <div className="row text-center">
              <AchievementItems />
            </div>
          </div>
          {showSelectedAchvment && (
            <div className="col-12 col-md-5 align-self-center">
              <div className="row justify-content-end">
                <div className="col-auto">
                  <Button
                    type="default"
                    className="border-0"
                    icon={<CloseOutlined />}
                    onClick={() => setShowSelectedAchvment(false)}
                  />
                </div>
              </div>
              <div className="row p-3">
                <div className="col-12">
                  <h4>{selectedAchvment?.title}</h4>
                  <span>Bronze: {selectedAchvment.bronze}</span>
                  <br />
                  <span>Silver: {selectedAchvment.silver}</span>
                  <br />
                  <span>Gold: {selectedAchvment.gold}</span>
                  <hr />
                  <span>Current count: {selectedAchvment.currentCount || 0}</span>
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

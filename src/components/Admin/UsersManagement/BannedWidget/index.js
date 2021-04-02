import React, { useEffect, useState } from 'react'
import CountIconWidget from 'components/Common/CountIconWidget'
import { getAllBannedSenseis, getAllBannedStudents } from 'services/admin'

const BannedWidget = () => {
  const [count, setCount] = useState(0)
  const [studentCount, setStudentCount] = useState(0)
  const [senseiCount, setSenseiCount] = useState(0)

  useEffect(() => {
    populateBanned()
  }, [])

  const populateBanned = async () => {
    // change endpoint
    const studentRsp = await getAllBannedStudents()
    const senseiRsp = await getAllBannedSenseis()
    let counter = 0

    if (studentRsp.length > 0) {
      counter += studentRsp.length
      setStudentCount(studentRsp.length)
    }
    if (senseiRsp.length > 0) {
      counter += senseiRsp.length
      setSenseiCount(senseiRsp.length)
    }

    setCount(counter)
  }

  return (
    <div className="row mt-4">
      <div className="col-12 col-md-4">
        <CountIconWidget
          title="Total Banned Students"
          count={studentCount}
          icon={<i className="fe fe-slash" />}
          color="blue"
        />
      </div>
      <div className="col-12 col-md-4">
        <CountIconWidget
          title="Total Banned Senseis"
          count={senseiCount}
          icon={<i className="fe fe-slash" />}
          color="purple"
        />
      </div>
      <div className="col-12 col-md-4">
        <CountIconWidget
          title="Total Banned Accounts"
          count={count}
          icon={<i className="fe fe-slash" />}
        />
      </div>
    </div>
  )
}

export default BannedWidget

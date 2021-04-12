import React, { useState, useEffect } from 'react'
import { Tabs } from 'antd'
import ChartistGraph from 'react-chartist'
import ChartistTooltip from 'chartist-plugin-tooltips-updated'
import { getMentees } from 'services/mentorship/subscription'
import { MONTH_NAMES } from 'constants/constants'

const { TabPane } = Tabs

const options = {
  chartPadding: {
    right: 0,
    left: 0,
    top: 5,
    bottom: 5,
  },
  fullWidth: true,
  showPoint: true,
  lineSmooth: true,
  axisY: {
    showGrid: false,
    showLabel: false,
    offset: 0,
  },
  axisX: {
    showGrid: true,
    showLabel: true,
    offset: 20,
  },
  showArea: false,
  plugins: [
    ChartistTooltip({
      anchorToPoint: false,
      appendToBody: true,
      seriesName: false,
    }),
  ],
}

const MenteeChart = props => {
  const [tabKey, setTabKey] = useState('Mentees')
  const [mentees, setMentees] = useState({})
  const [count, setCount] = useState([])

  const { accountId } = props

  const changeTab = key => {
    setTabKey(key)
  }

  useEffect(() => {
    const populateStudents = async () => {
      const response = await getMentees(accountId)
      const student = response.students
      const last6Month = new Date()
      last6Month.setMonth(last6Month.getMonth() - 5)
      setCount(student.length)

      const monthCounts = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
      let labels = []
      let data = []

      // Update MonthCounts
      for (let i = 0; i < student.length; i += 1) {
        for (let j = 0; j < student[i].MentorshipContracts.length; j += 1) {
          const date = new Date(student[i].MentorshipContracts[j].createdAt)

          if (last6Month.getTime() <= date.getTime()) {
            monthCounts[date.getMonth()] += 1
          }
        }
      }

      const month = last6Month.getMonth()
      for (let i = 0; i < 6; i += 1) {
        const key = (month + i) % 12
        labels = [...labels, MONTH_NAMES[key]]
        data = [...data, monthCounts[key]]
      }

      const output = {
        labels,
        series: [data],
      }

      setMentees(output)
    }

    populateStudents()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const showChart = () => {
    return (
      <div>
        <div className="font-weight-bold text-dark font-size-24">{count}</div>
        <div>Total Mentees</div>
        <ChartistGraph
          className="height-200 ct-hidden-points"
          data={mentees}
          options={options}
          type="Line"
        />
      </div>
    )
  }

  return (
    <div className="card">
      <div className="card-header card-header-flex">
        <div className="d-flex flex-column justify-content-center mr-auto">
          <h5>New Mentees Chart</h5>
        </div>
        <Tabs activeKey={tabKey} className="kit-tabs" onChange={changeTab}>
          <TabPane tab="Mentees" key="Mentees" />
        </Tabs>
      </div>

      <div className="card-body">{tabKey === 'Mentees' && showChart()}</div>
    </div>
  )
}

export default MenteeChart

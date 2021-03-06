import React, { useState, useEffect } from 'react'
import * as jwtAdmin from 'services/jwt/admin'
import ChartistGraph from 'react-chartist'
import ChartistTooltip from 'chartist-plugin-tooltips-updated'

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

const monthNames = [
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'May',
  'Jun',
  'Jul',
  'Aug',
  'Sep',
  'Oct',
  'Nov',
  'Dec',
]

const StudentGrowthChart = () => {
  const [students, setStudents] = useState({})
  const [count, setCount] = useState(0)
  useEffect(() => {
    populateStudents()
  }, [])

  const populateStudents = async () => {
    const response = await jwtAdmin.getAllStudents()
    const last6Month = new Date()
    last6Month.setMonth(last6Month.getMonth() - 5)
    setCount(response.length)

    const monthCounts = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
    let labels = []
    let data = []

    // Update MonthCounts
    for (let i = 0; i < response.length; i += 1) {
      const date = new Date(response[i].createdAt)

      if (last6Month.getTime() <= date.getTime()) {
        monthCounts[date.getMonth()] += 1
      }
    }

    const month = last6Month.getMonth()
    for (let i = 0; i < 6; i += 1) {
      const key = (month + i) % 12
      labels = [...labels, monthNames[key]]
      data = [...data, monthCounts[key]]
    }

    const output = {
      labels,
      series: [data],
    }

    setStudents(output)
  }

  return (
    <div>
      <div className="font-weight-bold text-dark font-size-24">{count}</div>
      <div>Total Students</div>
      <ChartistGraph
        className="height-200 ct-hidden-points"
        data={students}
        options={options}
        type="Line"
      />
    </div>
  )
}

export default StudentGrowthChart

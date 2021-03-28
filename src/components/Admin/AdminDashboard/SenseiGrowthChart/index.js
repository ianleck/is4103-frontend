import React, { useState, useEffect } from 'react'
import ChartistGraph from 'react-chartist'
import * as jwtAdmin from 'services/admin'
import ChartistTooltip from 'chartist-plugin-tooltips-updated'
import { MONTH_NAMES } from 'constants/constants'

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

const SenseiGrowthChart = () => {
  const [senseis, setSenseis] = useState({})
  const [count, setCount] = useState(0)
  useEffect(() => {
    populateSenseis()
  }, [])

  const populateSenseis = async () => {
    const response = await jwtAdmin.getAllSenseis()
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
      labels = [...labels, MONTH_NAMES[key]]
      data = [...data, monthCounts[key]]
    }

    const output = {
      labels,
      series: [data],
    }

    setSenseis(output)
  }

  return (
    <div>
      <div className="font-weight-bold text-dark font-size-24">{count}</div>
      <div>Total Senseis</div>
      <ChartistGraph
        className="height-200 ct-hidden-points"
        data={senseis}
        options={options}
        type="Line"
      />
    </div>
  )
}

export default SenseiGrowthChart

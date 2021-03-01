import React from 'react'
import ChartistGraph from 'react-chartist'
import ChartistTooltip from 'chartist-plugin-tooltips-updated'
import data from './data.json'

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
  return (
    <div>
      <div className="font-weight-bold text-dark font-size-24">31</div>
      <div>Total Senseis</div>
      <ChartistGraph
        className="height-200 ct-hidden-points"
        data={data}
        options={options}
        type="Line"
      />
    </div>
  )
}

export default SenseiGrowthChart

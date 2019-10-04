import React from 'react'
import './DemoProgress.scss'

import '@st-graphics/react-scrolly/dist/bundle.css'
import StScrolly from '@st-graphics/react-scrolly'

function DemoProgress (props) {
  const renderBackground = ({progress}) => (
    <div className="centered">
      <div className="card">
        <code>progress()</code><br />
        = {format(progress())}
      </div>
      <div className="card">
        <code>progress(true)</code><br />
        = {format(progress(true))}
      </div>
    </div>
  )

  return (
    <StScrolly className="demo-progress"
      renderBackground={renderBackground}>
    </StScrolly>
  )
}

export default DemoProgress

function format (v) {
  return (v * 100).toFixed() + '%'
}

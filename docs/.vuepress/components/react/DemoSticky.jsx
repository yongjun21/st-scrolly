import React from 'react'
import './DemoSticky.scss'

import '@st-graphics/react-scrolly/dist/bundle.css'
import StScrolly from '@st-graphics/react-scrolly'

function DemoSticky (props) {
  const renderBackground = (
    <div className="centered">This is a sticky background</div>
  )
  return (
    <StScrolly className="demo-sticky" renderBackground={renderBackground}></StScrolly>
  )
}

export default DemoSticky

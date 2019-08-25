import React from 'react'
import './DemoSlots.scss'

import '@st-graphics/react-scrolly/dist/bundle.css'
import StScrolly from '@st-graphics/react-scrolly'

function DemoSlots (props) {
  const renderBackground = (
    <div className="centered">This is a sticky background</div>
  )

  const renderForeground = (
    <div className="centered">This is a sticky foreground</div>
  )

  const slides = [(
    <div className="slide">
      <div className="card">Slide 1</div>
    </div>
  ), (
    <div className="slide">
      <div className="card">Slide 2</div>
    </div>
  ), (
    <div className="slide">
      <div className="card">Slide 3</div>
    </div>
  )]

  return (
    <StScrolly className="demo-slots"
      renderBackground={renderBackground}
      renderForeground={renderForeground}>
      {slides}
    </StScrolly>
  )
}

export default DemoSlots

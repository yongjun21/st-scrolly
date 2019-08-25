import React from 'react'
import './DemoSlideIndex.scss'

import '@st-graphics/react-scrolly/dist/bundle.css'
import StScrolly, {clamp} from '@st-graphics/react-scrolly'

const slides = [
  {text: 'Slide 1', bgStyle: {backgroundColor: 'red'}},
  {text: 'Slide 2', bgStyle: {backgroundColor: 'green'}},
  {text: 'Slide 3', bgStyle: {backgroundColor: 'blue'}}
]

function DemoSlideIndex (props) {
  const renderBackground = ({slideIndex}) => (
    <div style={getBgStyle(slideIndex)}>
      <div className="centered">This is a sticky background</div>
    </div>
  )

  const $slides = slides.map((slide, i) => (
    <div className="slide" key={i}>
      <div className="card">{slide.text}</div>
    </div>
  ))

  return (
    <StScrolly className="demo-slide-index"
      renderBackground={renderBackground}>
      {$slides}
    </StScrolly>
  )
}

function getBgStyle (slideIndex) {
  const clampedIndex = clamp(slideIndex, 0, slides.length - 1)
  return slides[clampedIndex].bgStyle
}

export default DemoSlideIndex

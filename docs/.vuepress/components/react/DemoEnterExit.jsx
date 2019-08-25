import React from 'react'
import './DemoEnterExit.scss'

import '@st-graphics/react-scrolly/dist/bundle.css'
import StScrolly from '@st-graphics/react-scrolly'

const slides = [
  {text: 'Slide 1', bgStyle: {backgroundColor: 'red'}},
  {text: 'Slide 2', bgStyle: {backgroundColor: 'green'}},
  {text: 'Slide 3', bgStyle: {backgroundColor: 'blue'}}
]

function DemoEnterExit (props) {
  const renderBackground = ({enter, exit}) => slides.map((slide, i) => (
    <div key={i} style={getBgStyle(i, enter, exit)}>
      <div class="centered">This is a sticky background</div>
    </div>
  ))

  const $slides = slides.map((slide, i) => (
    <div className="slide" key={i}>
      <div className="card">{slide.text}</div>
    </div>
  ))

  return (
    <StScrolly className="demo-enter-exit"
      renderBackground={renderBackground}>
      {$slides}
    </StScrolly>
  )
}

function getBgStyle (index, enter, exit) {
  const opacity = enter(index, 400) * exit(index, 400)
  return {
    ...slides[index].bgStyle,
    opacity
  }
}

export default DemoEnterExit

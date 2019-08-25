import React, {useState, useCallback} from 'react'
import './DemoTriggerOffset.scss'

import '@st-graphics/react-scrolly/dist/bundle.css'
import StScrolly, {clamp} from '@st-graphics/react-scrolly'

const slides = [
  {text: 'Slide 1', bgStyle: {backgroundColor: 'red'}},
  {text: 'Slide 2', bgStyle: {backgroundColor: 'green'}},
  {text: 'Slide 3', bgStyle: {backgroundColor: 'blue'}}
]

function DemoTriggerOffset (props) {
  const [triggerOffset, setTriggerOffset] = useState(-200)

  const onChange = useCallback(e => {
    setTriggerOffset(+e.target.value)
  }, [])

  const renderForeground = ({slideIndex}) => (
    <div className="centered">
      <div className="card">{getText(slideIndex)}</div>
      <label>
        Offset =
        <input type="number" min="-200" max="100" step="100"
          value={triggerOffset}
          onChange={onChange} />
      </label>
    </div>
  )

  const $slides = slides.map((slide, i) => (
    <div className="slide" key={i} style={slide.bgStyle}></div>
  ))

  return (
    <StScrolly className="demo-trigger-offset"
      triggerOffset={triggerOffset}
      renderForeground={renderForeground}>
      {$slides}
    </StScrolly>
  )
}

function getText (slideIndex) {
  const clampedIndex = clamp(slideIndex, 0, slides.length - 1)
  return slides[clampedIndex].text
}

export default DemoTriggerOffset

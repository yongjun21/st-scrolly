# React Guide

## Sticky background

<div style="text-align: center; margin-top: 1rem;">
  <iphone-mockup style="height: 40vh;" src="/demos/sticky" />
  <macbook-mockup style="height: 40vh;" src="/demos/sticky" />
</div>

```jsx{12}
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
```

```scss{4}
.demo-sticky {
  // control sticky distance by setting slide height
  .slide {
    height: 800px;
  }
}
```

## Basic structure

### Using `background`, `foreground` & `default` slots

<div style="text-align: center; margin-top: 1rem;">
  <iphone-mockup style="height: 40vh;" src="/demos/slots" />
  <macbook-mockup style="height: 40vh;" src="/demos/slots" />
</div>

```jsx{32-34}
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
```

## Dynamic content

### Using `slideIndex` from slot scope

<div style="text-align: center; margin-top: 1rem;">
  <iphone-mockup style="height: 40vh;" src="/demos/slide-index" />
  <macbook-mockup style="height: 40vh;" src="/demos/slide-index" />
</div>

```jsx{14-15}
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
```

```scss
.demo-slide-index {
  // control trigger points by setting slide height
  .slide {
    height: 800px;
  }
}
```

## Adjust trigger points

### Using `triggerOffset` props

<div style="text-align: center; margin-top: 1rem;">
  <iphone-mockup style="height: 40vh;" src="/demos/trigger-offset" />
  <macbook-mockup style="height: 40vh;" src="/demos/trigger-offset" />
</div>

```jsx{38}
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
```

## Positioning the sticky window

### Using `windowHeight` & `windowTop` props

<div style="text-align: center; margin-top: 1rem;">
  <iphone-mockup style="height: 40vh;" src="/demos/window" />
  <macbook-mockup style="height: 40vh;" src="/demos/window" />
</div>

```jsx{19-20}
import React, {useState, useEffect} from 'react'
import './DemoWindow.scss'

import '@st-graphics/react-scrolly/dist/bundle.css'
import StScrolly from '@st-graphics/react-scrolly'

function DemoWindow (props) {
  const [vh, setVh] = useState(0)
  useEffect(() => {
    setVh(window.innerHeight / 100)
  }, [])

  const renderBackground = (
    <div className="centered">This is a sticky background</div>
  )
  return (
    <StScrolly className="demo-window"
      renderBackground={renderBackground}
      windowHeight={60 * vh}
      windowTop={20 * vh}>
    </StScrolly>
  )
}

export default DemoWindow
```

## Smooth transition

### Using `enter` & `exit` from slot scope

<div style="text-align: center; margin-top: 1rem;">
  <iphone-mockup style="height: 40vh;" src="/demos/enter-exit" />
  <macbook-mockup style="height: 40vh;" src="/demos/enter-exit" />
</div>

```jsx{14-15,35}
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
```

```scss
.demo-enter-exit {
  // stack background layers on top of each other
  .background > div {
    position: absolute;
    left: 0;
    top: 0;
    right: 0;
    bottom: 0;
    opacity: 0;
    mix-blend-mode: overlay;
  }
}
```
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

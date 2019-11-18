import React, {useState, useEffect, useRef, useCallback} from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'
import './index.scss'

const supportsSticky = (function () {
  if (typeof window === 'undefined') return true
  const supports = window.CSS && window.CSS.supports
  if (!supports) return false
  return supports('position', 'sticky') || supports('position', '-webkit-sticky')
})()

const propTypes = {
  className: PropTypes.string,
  windowHeight: PropTypes.number,
  windowTop: PropTypes.number,
  triggerOffset: PropTypes.number,
  dontUseSticky: PropTypes.bool,
  renderBackground: PropTypes.oneOfType([
    PropTypes.node,
    PropTypes.func
  ]),
  renderForeground: PropTypes.oneOfType([
    PropTypes.node,
    PropTypes.func
  ]),
  children: PropTypes.oneOfType([
    PropTypes.node,
    PropTypes.func
  ])
}

const defaultProps = {
  windowTop: 0,
  triggerOffset: 0
}

function StScrolly (props) {
  const $slides = useRef(null)

  const [windowHeight, setWindowHeight] = useState(props.windowHeight || window.innerHeight)
  const [slideHeights, setSlideHeights] = useState([windowHeight])
  const [scrollPosition, setScrollPosition] = useState(0)

  const scrollCheckpoints = slideHeights.reduce((arr, h) => {
    return arr.concat(arr[arr.length - 1] + h)
  }, [0])
  const scrollLength = scrollCheckpoints[scrollCheckpoints.length - 1]

  const state = {
    windowHeight,
    scrollPosition,
    scrollCheckpoints,
    scrollLength
  }

  const active = scrollPosition >= 0 && scrollPosition < scrollLength
  const exposedScope = getExposedScope(props, state)
  const stickyStyle = getStickyStyle(props, state)

  const measure = useCallback(() => {
    const slideHeights = Array.prototype.map
      .call($slides.current.children, el => el.getBoundingClientRect().height)
    setSlideHeights(slideHeights)
  }, [])

  const handleScroll = useCallback(() => {
    measure()
    setScrollPosition(props.windowTop - $slides.current.getBoundingClientRect().top)
  }, [measure, props.windowTop])

  const handleResize = useCallback(() => {
    measure()
    setScrollPosition(props.windowTop - $slides.current.getBoundingClientRect().top)
    setWindowHeight(props.windowHeight || window.innerHeight)
  }, [measure, props.windowHeight, props.windowTop])

  useEffect(() => {
    handleResize()
    const _handleResize = frameRateLimited(handleResize)
    const _handleScroll = frameRateLimited(handleScroll)
    window.addEventListener('resize', _handleResize, {capture: true, passive: true})
    window.addEventListener('scroll', _handleScroll, {capture: true, passive: true})
    return () => {
      window.removeEventListener('resize', _handleResize)
      window.removeEventListener('scroll', _handleScroll)
    }
  }, [handleScroll, handleResize])

  const background =
    typeof props.renderBackground === 'function'
      ? props.renderBackground(exposedScope)
      : props.renderBackground
  const foreground =
    typeof props.renderForeground === 'function'
      ? props.renderForeground(exposedScope)
      : props.renderForeground
  const children =
    props.children == null
      ? (<div className="slide"></div>)
      : typeof props.children === 'function'
        ? props.children(exposedScope)
        : props.children

  return (
    <div className={classNames(props.className, 'st-scrolly', {active})}>
      <div className="background-container">
        <div className="background" style={stickyStyle}>
          {background}
        </div>
      </div>

      <div ref={$slides} className="slide-container">
        {children}
      </div>

      <div className="foreground-container">
        <div className="foreground" style={stickyStyle}>
          {foreground}
        </div>
      </div>
    </div>
  )
}

StScrolly.propTypes = propTypes
StScrolly.defaultProps = defaultProps

export default StScrolly

export function clamp (value, min, max) {
  return Math.min(Math.max(value, min), max)
}

function getExposedScope (props, state) {
  const {scrollPosition, scrollCheckpoints, scrollLength, windowHeight} = state
  const {triggerOffset} = props
  const offsetPosition = scrollPosition - triggerOffset
  const slideIndex = scrollCheckpoints.filter(h => offsetPosition >= h).length - 1
  const fromPrevSlide = offsetPosition < 0 ? Infinity
                      : offsetPosition - scrollCheckpoints[slideIndex]
  const toNextSlide = offsetPosition >= scrollLength ? Infinity
                    : scrollCheckpoints[slideIndex + 1] - offsetPosition

  const enter = (index, distance = 0, offset = triggerOffset) => {
    if (index < 0) index += scrollCheckpoints.length - 1
    const v1 = scrollCheckpoints[index]
    const v0 = v1 - distance
    const v = scrollPosition - offset
    if (distance === 0) return v >= v1 ? 1 : 0
    return clampedInterpolate(v, v0, v1)
  }
  const exit = (index, distance = 0, offset = triggerOffset) => {
    if (index < 0) index += scrollCheckpoints.length - 1
    const v0 = scrollCheckpoints[index + 1]
    const v1 = v0 - distance
    const v = scrollPosition - offset
    if (distance === 0) return v >= v0 ? 0 : 1
    return clampedInterpolate(v, v0, v1)
  }

  function getProgress (start, end) {
    const progress = (endEarly = false, offset = triggerOffset) => {
      const v0 = scrollCheckpoints[start]
      const v1 = scrollCheckpoints[end] - (endEarly ? windowHeight : 0)
      const v = scrollPosition - offset
      return clampedInterpolate(v, v0, v1)
    }
    progress.between = (start = 0, end = scrollCheckpoints.length - 1) => {
      if (start < 0) start += scrollCheckpoints.length - 1
      if (end < 0) end += scrollCheckpoints.length - 1
      return getProgress(start, end)
    }
    progress.at = (index) => {
      if (index < 0) index += scrollCheckpoints.length - 1
      return getProgress(index, index + 1)
    }
    return progress
  }

  return {
    slideIndex,
    slideCount: scrollCheckpoints.length - 1,
    scrollPosition,
    scrollLength,
    fromPrevSlide,
    toNextSlide,
    enter,
    exit,
    progress: getProgress(0, scrollCheckpoints.length - 1)
  }
}

function getStickyStyle (props, state) {
  const {scrollPosition, scrollLength} = state
  const {windowTop, windowHeight, dontUseSticky} = props
  let position = 'fixed'
  let top = windowTop + 'px'
  let bottom = 'auto'
  if (!dontUseSticky && supportsSticky) {
    position = 'sticky'
  } else if (scrollPosition < 0) {
    // align top
    position = 'absolute'
    top = '0'
  } else if (scrollPosition >= scrollLength - state.windowHeight) {
    // align bottom
    position = 'absolute'
    top = 'auto'
    bottom = '0'
  }
  return {
    position,
    top,
    bottom,
    height: windowHeight ? (windowHeight + 'px') : '100vh'
  }
}

function frameRateLimited (cb, context) {
  let ready = true
  let args
  function wrapped () {
    args = arguments
    if (!ready) return
    ready = false
    window.requestAnimationFrame(() => {
      cb.apply(this, args)
      ready = true
    })
  }
  return context ? wrapped.bind(context) : wrapped
}

function clampedInterpolate (v, v0, v1) {
  return Math.min(Math.max((v - v0) / (v1 - v0), 0), 1)
}

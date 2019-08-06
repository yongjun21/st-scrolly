import React, {useState, useEffect, useRef, useCallback} from 'react'
import PropTypes from 'prop-types'
import {omit} from './util'
import './ObjectFitVideo.scss'

const supportsObjectFit = window.CSS && window.CSS.supports &&
                          window.CSS.supports('object-fit', 'cover') &&
                          !/Edge/.test(window.navigator.userAgent)

const ObjectFitVideo = React.forwardRef((props, ref) => {
  const $el = useRef(null)

  const callbackRef = useCallback(el => {
    if (typeof ref === 'function') ref(el)
    else if (typeof ref === 'object') ref.current = el
    $el.current = el
  }, [ref])

  const [videoWidth, setVideoWidth] = useState(null)
  const [videoHeight, setVideoHeight] = useState(null)
  const [containerWidth, setContainerWidth] = useState(null)
  const [containerHeight, setContainerHeight] = useState(null)
  const state = {
    videoWidth,
    videoHeight,
    containerWidth,
    containerHeight
  }
  state.ready = videoWidth > 0 && containerWidth > 0

  const videoStyle = getVideoStyle(props, state)

  useEffect(() => {
    if (supportsObjectFit) return

    setContainerWidth($el.current.parentElement.clientWidth)
    setContainerHeight($el.current.parentElement.clientHeight)
    const measure = frameRateLimited(() => {
      setContainerWidth($el.current.parentElement.clientWidth)
      setContainerHeight($el.current.parentElement.clientHeight)
    })

    window.addEventListener('resize', measure, {capture: true, passive: true})
    const observer = new MutationObserver(measure)
    observer.observe($el.current.parentElement, {
      attributes: true,
      attributeFilter: ['class', 'style']
    })

    onLoadedmetadata($el.current, () => {
      setVideoWidth($el.current.videoWidth)
      setVideoHeight($el.current.videoHeight)
    })

    return () => {
      window.removeEventListener('resize', measure)
      observer.disconnect()
    }
  }, [])

  const rest = omit(props, 'objectFit', 'objectPosition')
  return (
    <video className="object-fit-video"
      ref={callbackRef}
      style={videoStyle}
      {...rest}>
      {props.children}
    </video>
  )
})

ObjectFitVideo.propTypes = {
  objectFit: PropTypes.oneOf(['fill', 'contain', 'cover', 'scale-down', 'none']),
  objectPosition: PropTypes.string
}

ObjectFitVideo.defaultProps = {
  objectFit: 'cover',
  objectPosition: '50% 50%'
}

export default ObjectFitVideo

function parsePosition (props, state) {
  const parsed = props.objectPosition.split(' ')
  if (parsed.length < 2) parsed.push('center')
  if (parsed[0] === 'top' || parsed[0] === 'bottom' ||
      parsed[1] === 'left' || parsed[1] === 'right') parsed.reverse()
  if (parsed[0] === 'left') parsed[0] = '0%'
  if (parsed[0] === 'center') parsed[0] = '50%'
  if (parsed[0] === 'right') parsed[0] = '100%'
  if (parsed[1] === 'top') parsed[1] = '0%'
  if (parsed[1] === 'center') parsed[1] = '50%'
  if (parsed[1] === 'bottom') parsed[1] = '100%'
  return parsed
}

function getVideoDimension (props, state) {
  const {videoWidth, videoHeight, containerWidth, containerHeight} = state
  const containerAspectRatio = containerHeight / containerWidth
  const videoAspectRatio = videoHeight / videoWidth
  switch (props.objectFit) {
    case 'fill':
      return {
        width: containerWidth,
        height: containerHeight
      }
    case 'contain':
      return containerAspectRatio >= videoAspectRatio ? {
        width: containerWidth,
        height: videoAspectRatio * containerWidth
      } : {
        width: containerHeight && containerHeight / videoAspectRatio,
        height: containerHeight
      }
    case 'cover':
      return containerAspectRatio >= videoAspectRatio ? {
        width: containerHeight && containerHeight / videoAspectRatio,
        height: containerHeight
      } : {
        width: containerWidth,
        height: videoAspectRatio * containerWidth
      }
    case 'scale-down':
      const minWidth = Math.min(containerWidth, videoWidth)
      const minHeight = Math.min(containerHeight, videoHeight)
      return containerAspectRatio >= videoAspectRatio ? {
        width: minWidth,
        height: videoAspectRatio * minWidth
      } : {
        width: minHeight && minHeight / videoAspectRatio,
        height: minHeight
      }
    default:
      return {
        width: videoWidth,
        height: videoHeight
      }
  }
}

function getVideoStyle (props, state) {
  if (supportsObjectFit) {
    return {
      objectFit: props.objectFit,
      objectPosition: props.objectPosition
    }
  }
  if (!state.ready) return {visibility: 'hidden'}
  return applyPosition(props, state)
}

function applyPosition (props, state) {
  const videoDimension = getVideoDimension(props, state)
  let [marginLeft, marginTop] = parsePosition(props, state)
  if (marginLeft[marginLeft.length - 1] === '%') {
    marginLeft = +marginLeft.slice(0, -1) / 100 * (state.containerWidth - videoDimension.width) + 'px'
  }
  if (marginTop[marginTop.length - 1] === '%') {
    marginTop = +marginTop.slice(0, -1) / 100 * (state.containerHeight - videoDimension.height) + 'px'
  }
  return {
    width: videoDimension.width + 'px',
    height: videoDimension.height + 'px',
    marginLeft,
    marginTop
  }
}

function frameRateLimited (cb, context) {
  let ready = true
  function wrapped () {
    if (!ready) return
    ready = false
    window.requestAnimationFrame(() => {
      cb.apply(this, arguments)
      ready = true
    })
  }
  return context ? wrapped.bind(context) : wrapped
}

function onLoadedmetadata ($video, cb) {
  if ($video.readyState > 0) {
    cb()
  } else {
    $video.addEventListener('loadedmetadata', cb)
  }
}

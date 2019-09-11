import React, {useState, useEffect, useRef} from 'react'
import PropTypes from 'prop-types'
import {omit} from './util'
import './index.scss'

import ObjectFitVideo from '@st-graphics/react-object-fit-video'

const propTypes = {
  progress: PropTypes.number.isRequired,
  framerate: PropTypes.number,
  maxspeed: PropTypes.number,
  renderArtefacts: PropTypes.oneOfType([
    PropTypes.node,
    PropTypes.func
  ])
}

const defaultProps = {
  framerate: 60,
  maxspeed: 4
}

function StVideoScrolly (props) {
  const $el = useRef(null)
  const video = useRef(null)

  const [duration, setDuration] = useState(0)
  const [actualFrame, setActualFrame] = useState(0)
  const state = useRef({}).current
  state.duration = duration
  state.actualFrame = actualFrame
  state.targetFrame = Math.floor(props.progress * duration * props.framerate)

  const playbackRate = getPlaybackRate(props, state)

  useEffect(() => {
    const $video = $el.current
    let rewinding = false
    $video.rewindSpeed = 1
    $video.rewind = function (until) {
      if (rewinding) return
      rewinding = true
      let t0 = Date.now()
      let v0 = $video.currentTime
      window.requestAnimationFrame(function reverse () {
        const targetTime = until()
        if ($video.currentTime <= targetTime) {
          rewinding = false
          return
        }
        const t1 = Date.now()
        const v1 = Math.max(v0 - $video.rewindSpeed * (t1 - t0) / 1000, targetTime)
        if (!$video.seeking) $video.currentTime = v1
        t0 = t1
        v0 = v1
        window.requestAnimationFrame(reverse)
      })
    }

    let reqID
    onLoadeddata($video, () => {
      video.current = $video
      setDuration($video.duration)
      pollActualFrame()
    })

    return () => {
      if (reqID) window.cancelAnimationFrame(reqID)
    }

    function pollActualFrame () {
      setActualFrame(Math.floor($video.currentTime * props.framerate))
      reqID = window.requestAnimationFrame(pollActualFrame)
    }
  }, [props.framerate])

  useEffect(() => {
    if (!video.current) return
    const $video = video.current
    if (props.progress <= 0 && playbackRate <= -props.maxspeed) {
      $video.currentTime = 0
      return
    }
    if (props.progress >= 1 && playbackRate >= props.maxspeed) {
      $video.currentTime = state.duration
      return
    }

    if (playbackRate > 0) {
      $video.playbackRate = playbackRate
      if ($video.paused) $video.play()
    } else {
      $video.pause()
      if (playbackRate < 0) {
        $video.rewindSpeed = -playbackRate
        $video.rewind(() => (state.targetFrame + 1) / props.framerate)
      }
    }
  }, [playbackRate, props.progress, props.framerate, props.maxspeed, state.duration, state.targetFrame])

  const rest = omit(props, 'progress', 'framerate', 'maxspeed')

  return (
    <div className="st-video-scrolly">
      <ObjectFitVideo
        ref={$el}
        muted
        autoPlay
        preload="auto"
        webkit-playsinline=""
        playsInline
        {...rest}>
      </ObjectFitVideo>
      {props.renderArtefacts && props.renderArtefacts(state)}
    </div>
  )
}

StVideoScrolly.propTypes = propTypes
StVideoScrolly.defaultProps = defaultProps

export default StVideoScrolly

function getPlaybackRate (props, state) {
  const diff = state.targetFrame - state.actualFrame
  if (diff >= 0) return Math.min(diff, props.maxspeed)
  return Math.max(diff + 1, -props.maxspeed)
}

function onLoadeddata ($video, cb) {
  if ($video.readyState > 1) cb()
  $video.addEventListener('loadeddata', cb)
}

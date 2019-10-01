<div class="st-scrolly" class:active>
  <div class="background-container">
    <div class="background" style={stickyStyle}>
      <slot name="background"
        {slideIndex}
        {slideCount}
        {scrollPosition}
        {scrollLength}
        {fromPrevSlide}
        {toNextSlide}
        {enter}
        {exit}
        {progress}>
      </slot>
    </div>
  </div>

  <div class="slide-container" bind:this={slidesRef}>
    <slot
      {slideIndex}
      {slideCount}
      {scrollPosition}
      {scrollLength}
      {fromPrevSlide}
      {toNextSlide}
      {enter}
      {exit}
      {progress}>
      <div class="slide"></div>
    </slot>
  </div>

  <div class="foreground-container">
    <div class="foreground" style={stickyStyle}>
      <slot name="foreground"
        {slideIndex}
        {slideCount}
        {scrollPosition}
        {scrollLength}
        {fromPrevSlide}
        {toNextSlide}
        {enter}
        {exit}
        {progress}>
      </slot>
    </div>
  </div>
</div>

<svelte:window on:resize={handleResize} on:scroll={handleScroll}/>

<script context="module">
const supportsSticky = (function () {
  if (typeof window === 'undefined') return true
  const supports = window.CSS && window.CSS.supports
  if (!supports) return false
  return supports('position', 'sticky') || supports('position', '-webkit-sticky')
})()

export function clamp (value, min, max) {
  return Math.min(Math.max(value, min), max)
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

function clampedInterpolate (v, v0, v1) {
  return Math.min(Math.max((v - v0) / (v1 - v0), 0), 1)
}

function renderStyle (obj) {
  return Object.entries(obj).map(([prop, value]) => `${prop}:${value};`).join('')
}
</script>

<script>
import {onMount} from 'svelte'

export let windowHeight = undefined
export let windowTop = 0
export let triggerOffset = 0
export let dontUseSticky = false

let slidesRef

let windowHeight_ = windowHeight || 0
let slideHeights = [windowHeight || 0]
let scrollPosition = -1

$: scrollCheckpoints = slideHeights.reduce((arr, h) => {
  arr.push(arr[arr.length - 1] + h)
  return arr
}, [0])
$: scrollLength = scrollCheckpoints[scrollCheckpoints.length - 1]

$: active = scrollPosition >= 0 && scrollPosition < scrollLength

$: offsetPosition = scrollPosition - triggerOffset

$: slideIndex = scrollCheckpoints.filter(h => offsetPosition >= h).length - 1
$: slideCount = scrollCheckpoints.length - 1
$: fromPrevSlide = offsetPosition < 0 ? Infinity : offsetPosition - scrollCheckpoints[slideIndex]
$: toNextSlide = offsetPosition >= scrollLength ? Infinity : scrollCheckpoints[slideIndex + 1] - offsetPosition
$: enter = (index, distance = 0, offset = triggerOffset) => {
  if (index < 0) index += scrollCheckpoints.length - 1
  const v1 = scrollCheckpoints[index]
  const v0 = v1 - distance
  const v = scrollPosition - offset
  if (distance === 0) return v >= v1 ? 1 : 0
  return clampedInterpolate(v, v0, v1)
}
$: exit = (index, distance = 0, offset = triggerOffset) => {
  if (index < 0) index += scrollCheckpoints.length - 1
  const v0 = scrollCheckpoints[index + 1]
  const v1 = v0 - distance
  const v = scrollPosition - offset
  if (distance === 0) return v >= v0 ? 0 : 1
  return clampedInterpolate(v, v0, v1)
}
$: progress = (function getProgress (start, end) {
  const progress = (endEarly = false, offset = triggerOffset) => {
    const v0 = scrollCheckpoints[start]
    const v1 = scrollCheckpoints[end] - (endEarly ? windowHeight_ : 0)
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
})(0, scrollCheckpoints.length - 1)

$: stickyStyle = (function () {
  let position = 'fixed'
  let top = windowTop + 'px'
  let bottom = 'auto'
  if (!dontUseSticky && supportsSticky) {
    position = 'sticky'
  } else if (scrollPosition < 0) {
    // align top
    position = 'absolute'
    top = '0'
  } else if (scrollPosition >= scrollLength - windowHeight_) {
    // align bottom
    position = 'absolute'
    top = 'auto'
    bottom = '0'
  }
  return renderStyle({
    position,
    top,
    bottom,
    height: windowHeight ? (windowHeight + 'px') : '100vh'
  })
})()

function scrollTo (index, triggerBased = false) {
  if (index < 0 || index > slideHeights.length) return null
  const initialPosition = window.scrollY + slidesRef.getBoundingClientRect().top - windowTop
  const targetOffsetPosition = scrollCheckpoints[index] + (triggerBased ? triggerOffset : 0)
  return initialPosition + targetOffsetPosition + 1
}

function measure () {
  slideHeights = Array.prototype.map
    .call(slidesRef.children, el => el.getBoundingClientRect().height)
}

const handleScroll = frameRateLimited(() => {
  measure()
  scrollPosition = windowTop - slidesRef.getBoundingClientRect().top
})

const handleResize = frameRateLimited(() => {
  measure()
  scrollPosition = windowTop - slidesRef.getBoundingClientRect().top
  windowHeight_ = windowHeight || window.innerHeight
})

onMount(handleResize)
</script>

<style lang="scss">
.st-scrolly {
  position: relative;
  width: 100%;

  .background-container,
  .foreground-container {
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
  }

  .background,
  .foreground {
    box-sizing: border-box;
    width: 100%;
    position: -webkit-sticky;
    position: sticky;
  }

  .background-container {
    z-index: 0;
  }

  .slide-container {
    position: relative;
    z-index: 1;
    pointer-events: none;

    & > * {
      box-sizing: border-box;
    }
  }

  .foreground-container {
    z-index: 2;
    pointer-events: none;
  }

  .foreground *,
  .slide * {
    pointer-events: auto;
  }
}
</style>

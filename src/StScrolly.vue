<template>
  <div class="st-scrolly" :class="{active}">
    <div class="background-container">
      <div class="background" :style="stickyStyle">
        <slot name="background" v-bind="exposedScope"></slot>
      </div>
    </div>

    <div ref="slides" class="slide-container">
      <slot v-bind="exposedScope"></slot>
    </div>

    <div class="foreground-container">
      <div class="foreground" :style="stickyStyle">
        <slot name="foreground" v-bind="exposedScope"></slot>
      </div>
    </div>
  </div>
</template>

<script>
const supportsSticky = window.CSS && window.CSS.supports &&
                      (window.CSS.supports('position', 'sticky') ||
                       window.CSS.supports('position', '-webkit-sticky'))

export default {
  props: {
    windowHeight: Number,
    windowTop: {
      type: Number,
      default: 0
    },
    triggerOffset: {
      type: Number,
      default: 0
    },
    dontUseSticky: Boolean
  },
  data () {
    const windowHeight = this.windowHeight || window.innerHeight
    return {
      windowHeight_: windowHeight,
      slideHeights: [windowHeight],
      scrollPosition: 0
    }
  },
  computed: {
    scrollCheckpoints () {
      return this.slideHeights.reduce((arr, h) => {
        arr.push(arr[arr.length - 1] + h)
        return arr
      }, [0])
    },
    scrollLength () {
      return this.scrollCheckpoints[this.scrollCheckpoints.length - 1]
    },
    active () {
      const {scrollPosition} = this
      return scrollPosition >= 0 && scrollPosition < this.scrollLength
    },
    exposedScope () {
      const {scrollPosition, scrollCheckpoints, scrollLength, triggerOffset, windowHeight_} = this
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
    },
    stickyStyle () {
      let position = 'fixed'
      let top = this.windowTop + 'px'
      let bottom = 'auto'
      if (!this.dontUseSticky && supportsSticky) {
        position = ['-webkit-sticky', 'sticky']
      } else if (this.scrollPosition < 0) {
        // align top
        position = 'absolute'
        top = '0'
      } else if (this.scrollPosition >= this.scrollLength - this.windowHeight_) {
        // align bottom
        position = 'absolute'
        top = 'auto'
        bottom = '0'
      }
      return {
        position,
        top,
        bottom,
        height: this.windowHeight ? (this.windowHeight + 'px') : '100vh'
      }
    }
  },
  methods: {
    scrollTo (index) {
      if (index < 0 || index >= this.slideHeights.length) return null
      const targetScrollPosition = this.scrollCheckpoints[index] + this.triggerOffset
      return window.scrollY + this.$el.getBoundingClientRect().top - this.windowTop + targetScrollPosition + 1
    },
    handleScroll () {
      this.scrollPosition = this.windowTop - this.$el.getBoundingClientRect().top
    },
    handleResize () {
      const $slides = this.$refs.slides.children
      this.slideHeights = Array.prototype.map
        .call($slides, el => el.getBoundingClientRect().height)
      this.windowHeight_ = this.windowHeight || window.innerHeight
    }
  },
  mounted () {
    this.handleResize()
    this.handleScroll()
    this.handleScroll = frameRateLimited(this.handleScroll)
    this.handleResize = frameRateLimited(this.handleResize)
    window.addEventListener('resize', this.handleResize, {capture: true, passive: true})
    window.addEventListener('scroll', this.handleScroll, {capture: true, passive: true})
  },
  beforeDestroy () {
    window.removeEventListener('resize', this.handleResize)
    window.removeEventListener('scroll', this.handleScroll)
  }
}

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

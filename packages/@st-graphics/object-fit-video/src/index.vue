<template>
  <video class="object-fit-video"
    :style="videoStyle"
    :muted="muted != null"
    v-on="$listeners">
    <slot></slot>
  </video>
</template>

<script>
const supportsObjectFit = window.CSS && window.CSS.supports &&
                          window.CSS.supports('object-fit', 'cover') &&
                          !/Edge/.test(window.navigator.userAgent)

export default {
  name: 'ObjectFitVideo',
  props: {
    objectFit: {
      type: String,
      validator: prop => ['fill', 'contain', 'cover', 'scale-down', 'none'].includes(prop),
      default: 'cover'
    },
    objectPosition: {
      type: String,
      default: '50% 50%'
    },
    muted: null // muted is applied directly as a DOM prop so need to be handled separately from the other attrs
  },
  data () {
    return {
      videoWidth: null,
      videoHeight: null,
      containerWidth: null,
      containerHeight: null
    }
  },
  computed: {
    ready () {
      return this.videoWidth > 0 && this.containerWidth > 0
    },
    parsedPosition () {
      const parsed = this.objectPosition.split(' ')
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
    },
    videoDimension () {
      const {videoWidth, videoHeight, containerWidth, containerHeight} = this
      const containerAspectRatio = containerHeight / containerWidth
      const videoAspectRatio = videoHeight / videoWidth
      switch (this.objectFit) {
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
    },
    videoStyle () {
      if (supportsObjectFit) {
        return {
          objectFit: this.objectFit,
          objectPosition: this.objectPosition
        }
      }
      if (!this.ready) return {visibility: 'hidden'}
      return this.applyPosition(this.videoDimension)
    }
  },
  methods: {
    measureVideo () {
      this.videoWidth = this.$el.videoWidth
      this.videoHeight = this.$el.videoHeight
    },
    measureContainer () {
      this.containerWidth = this.$el.parentElement.clientWidth
      this.containerHeight = this.$el.parentElement.clientHeight
    },
    applyPosition (dimension) {
      let [marginLeft, marginTop] = this.parsedPosition
      if (marginLeft[marginLeft.length - 1] === '%') {
        marginLeft = +marginLeft.slice(0, -1) / 100 * (this.containerWidth - dimension.width) + 'px'
      }
      if (marginTop[marginTop.length - 1] === '%') {
        marginTop = +marginTop.slice(0, -1) / 100 * (this.containerHeight - dimension.height) + 'px'
      }
      return {
        width: dimension.width + 'px',
        height: dimension.height + 'px',
        marginLeft,
        marginTop
      }
    }
  },
  mounted () {
    if (supportsObjectFit) return
    this.measureContainer()
    this.measureContainer = frameRateLimited(this.measureContainer)
    window.addEventListener('resize', this.measureContainer, {capture: true, passive: true})
    this.observer = new MutationObserver(this.measureContainer)
    this.observer.observe(this.$el.parentElement, {
      attributes: true,
      attributeFilter: ['class', 'style']
    })

    if (this.$el.readyState > 0) this.measureVideo()
    else this.$el.addEventListener('loadedmetadata', this.measureVideo)
  },
  beforeDestroy () {
    if (supportsObjectFit) return
    window.removeEventListener('resize', this.measureContainer)
    this.observer.disconnect()
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
</script>

<style>
.object-fit-video {
  display: block;
  width: 100%;
  height: 100%;
}
</style>

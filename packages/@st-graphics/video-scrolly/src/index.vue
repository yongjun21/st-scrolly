<template>
  <div class="st-video-scrolly">
    <object-fit-video
      ref="video"
      v-bind="$attrs"
      muted
      autoplay
      preload="auto"
      webkit-playsinline
      playsinline
      v-on="$listeners">
      <slot></slot>
    </object-fit-video>
    <slot name="artefacts" v-bind="{actualFrame, targetFrame, duration}"></slot>
  </div>
</template>

<script>
import ObjectFitVideo from '@st-graphics/object-fit-video'

export default {
  name: 'StVideoScrolly',
  components: {ObjectFitVideo},
  inheritAttrs: false,
  props: {
    progress: {
      type: Number,
      required: true
    },
    framerate: {
      type: Number,
      default: 60
    },
    maxspeed: {
      type: Number,
      default: 4
    }
  },
  data () {
    return {
      duration: 0,
      actualFrame: 0
    }
  },
  computed: {
    targetFrame () {
      return Math.floor(this.progress * this.duration * this.framerate)
    },
    playbackRate () {
      const diff = this.targetFrame - this.actualFrame
      if (diff >= 0) return Math.min(diff, this.maxspeed)
      return Math.max(diff + 1, -this.maxspeed)
    }
  },
  methods: {
    pollActualFrame ($video) {
      this.actualFrame = Math.floor($video.currentTime * this.framerate)
      this.reqID = window.requestAnimationFrame(this.pollActualFrame)
    }
  },
  mounted () {
    const $video = this.$refs.video.$el

    let rewinding = false
    let rewindSpeed = 1
    function rewind (until) {
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
        const v1 = Math.max(v0 - rewindSpeed * (t1 - t0) / 1000, targetTime)
        if (!$video.seeking) $video.currentTime = v1
        t0 = t1
        v0 = v1
        window.requestAnimationFrame(reverse)
      })
    }

    $video.addEventListener('loadeddata', e => {
      this.duration = $video.duration
      this.pollActualFrame()
      this.$watch('playbackRate', playbackRate => {
        if (this.progress <= 0 && playbackRate <= -this.maxspeed) {
          $video.currentTime = 0
          return
        }
        if (this.progress >= 1 && playbackRate >= this.maxspeed) {
          $video.currentTime = this.duration
          return
        }

        if (playbackRate > 0) {
          $video.playbackRate = playbackRate
          if ($video.paused) $video.play()
        } else {
          $video.pause()
          if (playbackRate < 0) {
            rewindSpeed = -playbackRate
            rewind(() => (this.targetFrame + 1) / this.framerate)
          }
        }
      }, {immediate: true})
    })
  },
  beforeDestroy () {
    if (this.reqID) window.cancelAnimationFrame(this.reqID)
  }
}
</script>

<style lang="scss">
.st-video-scrolly {
  position: relative;
  overflow: hidden;
  width: 100%;
  height: 100%;

  & > video {
    z-index: -1;
  }
}
</style>

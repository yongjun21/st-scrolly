<template>
  <st-scrolly class="demo-slide-index">
    <template v-slot:background="{slideIndex}">
      <div :style="getBgStyle(slideIndex)">
        <div class="centered">This is a sticky background</div>
      </div>
    </template>

    <div class="slide" v-for="(slide, i) in slides" :key="i">
      <div class="card">{{slide.text}}</div>
    </div>
  </st-scrolly>
</template>

<script>
import '@st-graphics/scrolly/dist/bundle.css'
import StScrolly, {clamp} from '@st-graphics/scrolly'

export default {
  components: {StScrolly},
  data () {
    return {
      slides: [
        {text: 'Slide 1', bgStyle: {backgroundColor: 'red'}},
        {text: 'Slide 2', bgStyle: {backgroundColor: 'green'}},
        {text: 'Slide 3', bgStyle: {backgroundColor: 'blue'}}
      ]
    }
  },
  methods: {
    getBgStyle (slideIndex) {
      const {slides} = this
      const clampedIndex = clamp(slideIndex, 0, slides.length - 1)
      return slides[clampedIndex].bgStyle
    }
  }
}
</script>

<style lang="scss">
.demo-slide-index {
  .slide {
    padding: 60vh 10% 0;
  }

  .background > div {
    height: 100%;

    & > div {
      height: 50%;
    }
  }
}
</style>

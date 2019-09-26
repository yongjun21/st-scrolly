<template>
  <st-scrolly class="demo-enter-exit">
    <template v-slot:background="{enter, exit}">
      <div v-for="(slide, i) in slides" :key="i" :style="getBgStyle(i, enter, exit)">
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
    getBgStyle (index, enter, exit) {
      const {slides} = this
      const opacity = Math.min(enter(index, 400), exit(index, 400))
      return {
        ...slides[index].bgStyle,
        opacity
      }
    }
  }
}
</script>

<style lang="scss">
.demo-enter-exit {
  .slide {
    padding: 60vh 10% 0;
  }

  .background {
    background-color: grey;
  }

  .background > div {
    position: absolute;
    left: 0;
    top: 0;
    right: 0;
    bottom: 0;
    opacity: 0;
    mix-blend-mode: overlay;

    & > div {
      height: 50%;
    }
  }
}
</style>

<template>
  <st-scrolly class="demo-trigger-offset" :trigger-offset="triggerOffset">
    <div class="slide" v-for="(slide, i) in slides" :key="i" :style="slide.bgStyle"></div>

    <template v-slot:foreground="{slideIndex}">
      <div class="centered">
        <div class="card">{{getText(slideIndex)}}</div>
        <label>
          Offset =
          <input type="number" min="-200" max="100" v-model.number="triggerOffset" step="100">
        </label>
      </div>
    </template>
  </st-scrolly>
</template>

<script>
import '@st-graphics/scrolly/dist/bundle.css'
import StScrolly, {clamp} from '@st-graphics/scrolly'

export default {
  components: {StScrolly},
  data () {
    return {
      triggerOffset: -200,
      slides: [
        {text: 'Slide 1', bgStyle: {backgroundColor: 'red'}},
        {text: 'Slide 2', bgStyle: {backgroundColor: 'green'}},
        {text: 'Slide 3', bgStyle: {backgroundColor: 'blue'}}
      ]
    }
  },
  methods: {
    getText (slideIndex) {
      const {slides} = this
      const clampedIndex = clamp(slideIndex, 0, slides.length - 1)
      return slides[clampedIndex].text
    }
  }
}
</script>

<style lang="scss">
.demo-trigger-offset {
  .foreground > div {
    height: 100%;
  }

  label {
    margin-top: 16px;
    font-size: 12px;
    font-weight: 700;
  }

  input[type="number"] {
    width: 50px;
  }
}
</style>

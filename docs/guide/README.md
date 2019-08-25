# Guide

## Sticky background

<div style="text-align: center; margin-top: 1rem;">
  <iphone-mockup style="height: 40vh;" src="/demos/sticky" />
  <macbook-mockup style="height: 40vh;" src="/demos/sticky" />
</div>

```vue{4,23}
<template>
  <st-scrolly class="demo-sticky">
    <!-- sticky items should be placed in the background slot-->
    <template v-slot:background>
      <div class="centered">This is a sticky background</div>
    </template>
  </st-scrolly>
</template>

<script>
import '@st-graphics/scrolly/dist/bundle.css'
import StScrolly from '@st-graphics/scrolly'

export default {
  components: {StScrolly}
}
</script>

<style lang="scss">
.demo-sticky {
  // control sticky distance by setting slide height
  .slide {
    height: 800px;
  }
}
</style>
```

## Basic structure

### Using `background`, `foreground` & `default` slots

<div style="text-align: center; margin-top: 1rem;">
  <iphone-mockup style="height: 40vh;" src="/demos/slots" />
  <macbook-mockup style="height: 40vh;" src="/demos/slots" />
</div>

```vue{4,9,22}
<template>
  <st-scrolly class="demo-slots">
    <!-- this is sticky -->
    <template v-slot:background>
      <div class="centered">This is a sticky background</div>
    </template>

    <!-- scrollable static content here -->
    <template v-slot:default>
      <div class="slide">
        <div class="card">Slide 1</div>
      </div>
      <div class="slide">
        <div class="card">Slide 2</div>
      </div>
      <div class="slide">
        <div class="card">Slide 3</div>
      </div>
    </template>

    <!-- this is also sticky -->
    <template v-slot:foreground>
      <div class="centered">This is a sticky foreground</div>
    </template>
  </st-scrolly>
</template>

<script>
import '@st-graphics/scrolly/dist/bundle.css'
import StScrolly from '@st-graphics/scrolly'

export default {
  components: {StScrolly}
}
</script>
```

## Dynamic content

### Using `slideIndex` from slot scope

<div style="text-align: center; margin-top: 1rem;">
  <iphone-mockup style="height: 40vh;" src="/demos/slide-index" />
  <macbook-mockup style="height: 40vh;" src="/demos/slide-index" />
</div>

```vue{3-4}
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
      // clamp slideIndex to [0, n - 1]
      const clampedIndex = clamp(slideIndex, 0, slides.length - 1)
      return slides[clampedIndex].bgStyle
    }
  }
}
</script>

<style lang="scss">
.demo-slide-index {
  // control trigger points by setting slide height
  .slide {
    height: 800px;
  }
}
</style>
```

## Adjust trigger points

### Using `triggerOffset` props

<div style="text-align: center; margin-top: 1rem;">
  <iphone-mockup style="height: 40vh;" src="/demos/trigger-offset" />
  <macbook-mockup style="height: 40vh;" src="/demos/trigger-offset" />
</div>

```vue{2}
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
      // clamp slideIndex to [0, n - 1]
      const clampedIndex = clamp(slideIndex, 0, slides.length - 1)
      return slides[clampedIndex].text
    }
  }
}
</script>
```

## Positioning the sticky window

### Using `windowHeight` & `windowTop` props

<div style="text-align: center; margin-top: 1rem;">
  <iphone-mockup style="height: 40vh;" src="/demos/window" />
  <macbook-mockup style="height: 40vh;" src="/demos/window" />
</div>

```vue{2}
<template>
  <st-scrolly class="demo-window" :window-height="60 * vh" :window-top="20 * vh">
    <template v-slot:background>
      <div class="centered">This is a sticky background</div>
    </template>
  </st-scrolly>
</template>

<script>
import '@st-graphics/scrolly/dist/bundle.css'
import StScrolly from '@st-graphics/scrolly'

export default {
  components: {StScrolly},
  data () {
    return {
      vh: window.innerHeight / 100
    }
  }
}
</script>
```

## Smooth transition

### Using `enter` & `exit` from slot scope

<div style="text-align: center; margin-top: 1rem;">
  <iphone-mockup style="height: 40vh;" src="/demos/enter-exit" />
  <macbook-mockup style="height: 40vh;" src="/demos/enter-exit" />
</div>

```vue{3-4,33}
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
      const opacity = enter(index, 400) * exit(index, 400)
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
  // stack background layers on top of each other
  .background > div {
    position: absolute;
    left: 0;
    top: 0;
    right: 0;
    bottom: 0;
    opacity: 0;
    mix-blend-mode: overlay;
  }
}
</style>
```
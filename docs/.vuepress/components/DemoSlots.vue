<template>
  <st-scrolly class="demo-slots">
    <template v-slot:background>
      <div class="centered">This is a sticky background</div>
    </template>

    <div class="slide">
      <div class="card">Slide 1</div>
    </div>
    <div class="slide">
      <div class="card">Slide 2</div>
    </div>
    <div class="slide">
      <div class="card">Slide 3</div>
    </div>

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

<style lang="scss">
.demo-slots {
  .slide {
    padding: 60vh 10% 0;
  }

  .background > div,
  .foreground > div {
    position: relative;
    height: 50%;
  }

  .foreground > div {
    background-color: red;
    top: 0;
  }

  .background > div {
    background-color: blue;
    top: 50%;
  }
}
</style>

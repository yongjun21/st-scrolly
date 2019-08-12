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
      vh: 0
    }
  },
  mounted () {
    this.vh = window.innerHeight / 100
  }
}
</script>

<style lang="scss">
.demo-window {
  .background > div {
    background-color: red;
    height: 100%;
  }
}
</style>

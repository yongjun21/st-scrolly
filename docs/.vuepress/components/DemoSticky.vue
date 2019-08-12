<template>
  <st-scrolly class="demo-sticky">
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
  .background > div {
    background-color: red;
    height: 100%;
  }
}
</style>

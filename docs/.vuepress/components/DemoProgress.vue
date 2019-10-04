<template>
  <st-scrolly class="demo-progress">
    <template v-slot:background="{slideIndex, progress}">
      <div class="centered">
        <div class="card">
          <code>progress()</code><br>
          = {{progress() | format}}
        </div>
        <div class="card">
          <code>progress(true)</code><br>
          = {{progress(true) | format}}
        </div>
      </div>
    </template>
  </st-scrolly>
</template>

<script>
import '@st-graphics/scrolly/dist/bundle.css'
import StScrolly from '@st-graphics/scrolly'

export default {
  filters: {
    format: v => (v * 100).toFixed() + '%'
  },
  components: {StScrolly}
}
</script>

<style lang="scss">
.demo-progress {
  .background > div {
    background-color: red;
    height: 100%;
  }

  .card {
    padding: 20px 0;
    line-height: 30px;

    code {
      background-color: black;
      color: white;
      margin: 0 -0.5em;
      padding: 0.5em;
      line-height: calc(30px - 1em);
      border-radius: 0.5em;
      font-size: 10px;
    }
  }

  .card + .card {
    margin-top: 16px;
  }
}
</style>

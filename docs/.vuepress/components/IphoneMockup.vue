<script>
export default {
  functional: true,
  props: {
    src: {
      type: String,
      required: true
    }
  },
  render (h, {props, data}) {
    data.class = [data.class, 'iphone-mockup']
    return h('div', data, [
      h('img', {
        attrs: {
          height: '100%',
          src: require('../../assets/iphone-mockup.png')
        }
      }),
      h('iframe', {
        attrs: {
          src: props.src,
          width: '65%',
          height: '92%'
        }
      })
    ])
  }
}
</script>

<style lang="scss">
.iphone-mockup {
  position: relative;
  display: inline-block;

  img {
    position: relative;
    z-index: 1;
    pointer-events: none;
  }

  iframe {
    position: absolute;
    left: 18%;
    top: 2%;
    z-index: 0;
    border: 0;
    background-color: black;
  }
}
</style>

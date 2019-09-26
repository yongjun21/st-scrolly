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
    data.class = [data.class, 'macbook-mockup']
    return h('div', data, [
      h('img', {
        attrs: {
          height: '100%',
          src: require('../../assets/macbook-mockup.png')
        }
      }),
      h('iframe', {
        attrs: {
          src: props.src,
          width: '85%',
          height: '79%'
        }
      })
    ])
  }
}
</script>

<style lang="scss">
.macbook-mockup {
  position: relative;
  display: inline-block;

  img {
    position: relative;
    z-index: 1;
    pointer-events: none;
  }

  iframe {
    position: absolute;
    left: 8%;
    top: 6%;
    z-index: 0;
    border: 0;
    background-color: black;
  }
}
</style>

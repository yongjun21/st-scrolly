module.exports = {
  title: '@st-graphics/scrolly',
  description: 'Opensource scrollytelling components used by Straits Times Interactive Graphics Team',
  scss: {
    implementation: require('sass')
  },
  evergreen: true,
  markdown: {
    lineNumbers: true
  },
  themeConfig: {
    repo: 'yongjun21/st-scrolly',
    nav: [
      { text: 'Home', link: '/' },
      { text: 'Guide', link: '/guide/' }
    ],
    sidebar: [
      '/',
      ['/guide/', 'Guide']
    ]
  }
}

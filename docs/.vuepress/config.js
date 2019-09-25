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
      {text: 'Home', link: '/'},
      {text: 'Guide', items: [
        {text: 'Vue', link: '/guide/'},
        {text: 'React', link: '/react/'}
      ]},
      {text: 'API', link: '/api/'}
    ],
    sidebar: [
      '/',
      ['/guide/', 'Guide'],
      ['/react/', 'Using with React'],
      ['/api/', 'API']
    ]
  }
}

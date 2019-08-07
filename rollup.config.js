import path from 'path'
import buble from 'rollup-plugin-buble'
import vue from 'rollup-plugin-vue'
import css from 'rollup-plugin-css-only'
import commonjs from 'rollup-plugin-commonjs'
import sass from 'rollup-plugin-sass'

const PKG_DIR = 'packages/@st-graphics'

const packages = [
  'scrolly',
  'video-scrolly',
  'object-fit-video'
]

export default [
  ...packages.map(createVueBuild),
  ...packages.map(createReactBuild)
]

function createVueBuild (pkg) {
  return {
    input: path.join(PKG_DIR, pkg, 'src/index.vue'),
    output: [{
      format: 'esm',
      file: path.join(PKG_DIR, pkg, 'dist/index.js'),
      sourcemap: true
    }, {
      format: 'cjs',
      file: path.join(PKG_DIR, pkg, 'dist/legacy.js'),
      sourcemap: true
    }],
    plugins: [
      css({output: path.join(PKG_DIR, pkg, 'dist/bundle.css')}),
      vue({css: false}),
      buble(),
      commonjs()
    ]
  }
}

function createReactBuild (pkg) {
  pkg = 'react-' + pkg
  return {
    external: [
      'react',
      'prop-types',
      'classnames'
    ],
    input: path.join(PKG_DIR, pkg, 'src/index.jsx'),
    output: [{
      format: 'esm',
      file: path.join(PKG_DIR, pkg, 'dist/index.js'),
      sourcemap: true
    }, {
      format: 'cjs',
      file: path.join(PKG_DIR, pkg, 'dist/legacy.js'),
      sourcemap: true
    }],
    plugins: [
      sass({output: path.join(PKG_DIR, pkg, 'dist/bundle.css')}),
      buble({objectAssign: 'Object.assign'})
    ]
  }
}

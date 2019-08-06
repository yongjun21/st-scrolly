import path from 'path'
import buble from 'rollup-plugin-buble'
import vue from 'rollup-plugin-vue'
import css from 'rollup-plugin-css-only'
import commonjs from 'rollup-plugin-commonjs'
import sass from 'rollup-plugin-sass'

const INPUT_DIR = 'src'
const SHARED_DIR = 'shared'
const CJS_DIR = 'commonjs'

const filenames = [
  'StScrolly',
  'StVideoScrolly',
  'ObjectFitVideo'
]

export default [{
  input: filenames.map(name => path.join(INPUT_DIR, 'vue', name + '.vue')),
  output: getOutput('vue'),
  plugins: [
    css({output: path.join('vue', 'bundle.css')}),
    vue({css: false}),
    buble(),
    commonjs()
  ]
}, {
  external: [
    'react',
    'prop-types',
    'classnames'
  ],
  input: filenames.map(name => path.join(INPUT_DIR, 'react', name + '.jsx')),
  output: getOutput('react'),
  plugins: [
    sass({output: path.join('react', 'bundle.css')}),
    buble({objectAssign: 'Object.assign'})
  ]
}]

function getOutput (OUTPUT_DIR) {
  return [{
    format: 'esm',
    dir: OUTPUT_DIR,
    entryFileNames: '[name].js',
    chunkFileNames: SHARED_DIR + '/[hash].js',
    sourcemap: true
  }, {
    format: 'cjs',
    dir: path.join(OUTPUT_DIR, CJS_DIR),
    entryFileNames: '[name].js',
    chunkFileNames: SHARED_DIR + '/[hash].js',
    sourcemap: true
  }]
}

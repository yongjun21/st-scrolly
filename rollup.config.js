import path from 'path'
import buble from 'rollup-plugin-buble'
import vue from 'rollup-plugin-vue'
import css from 'rollup-plugin-css-only'
import commonjs from 'rollup-plugin-commonjs'
import sass from 'rollup-plugin-sass'

const INPUT_DIR = 'src'
const OUTPUT_DIR = 'dist'

const filenames = [
  'StScrolly',
  'StVideoScrolly',
  'ObjectFitVideo'
]

export default [{
  input: filenames.map(name => path.join(INPUT_DIR, name + '.vue')),
  output: [{
    format: 'esm',
    dir: OUTPUT_DIR,
    entryFileNames: '[name].js',
    chunkFileNames: '[hash].js',
    sourcemap: true
  }, {
    format: 'cjs',
    dir: OUTPUT_DIR,
    entryFileNames: '[name].common.js',
    chunkFileNames: '[hash].js',
    sourcemap: true
  }],
  plugins: [
    css({output: path.join(OUTPUT_DIR, 'bundle.css')}),
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
  output: [{
    format: 'esm',
    dir: path.join(OUTPUT_DIR, 'react'),
    entryFileNames: '[name].js',
    chunkFileNames: '[hash].js',
    sourcemap: true
  }, {
    format: 'cjs',
    dir: path.join(OUTPUT_DIR, 'react'),
    entryFileNames: '[name].common.js',
    chunkFileNames: '[hash].js',
    sourcemap: true
  }],
  plugins: [
    sass({output: path.join(OUTPUT_DIR, 'react', 'bundle.css')}),
    buble({objectAssign: 'Object.assign'})
  ]
}]

/* eslint no-console:0, import/no-extraneous-dependencies:0 */

const fs = require('fs-extra')
const path = require('path')
const webpack = require('webpack')

const SRC_DIR = path.join(__dirname, '../src/shared/')
const BUILD_DIR = path.join(__dirname, '../intermediate-builds/shared/')

if (process.env.NODE_ENV !== 'production') {
  throw new Error('Builds must have NODE_ENV=production')
}

// Empty the build directory.
fs.emptyDirSync(BUILD_DIR)

const webpackConfig = {
  entry: path.resolve(SRC_DIR, './js/background.js'),
  output: {
    filename: 'background.js',
    path: path.resolve(BUILD_DIR, 'js'),
  },
  module: {
    rules: [
      {
        test: /\.m?js$/,
        exclude: /(node_modules|bower_components)/,
        use: {
          loader: 'babel-loader',
        },
      },
    ],
  },
}

webpack(webpackConfig).run(err => {
  if (err) {
    console.log('Failed to compile.', err)
    process.exit(1)
  }
  console.log('Webpack JS build complete.')
})

// Copy other files.
fs.copySync(path.join(SRC_DIR, 'img'), path.join(BUILD_DIR, 'img'))

console.log('Copied shared files to intermediate build.')

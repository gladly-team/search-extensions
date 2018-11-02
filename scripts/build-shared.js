
var fs = require('fs-extra')
var path = require('path')
var webpack = require('webpack')

var SRC_DIR = path.join(__dirname, '../src/shared/')
var BUILD_DIR = path.join(__dirname, '../intermediate-builds/shared/')

if (process.env.NODE_ENV !== 'production') {
  throw new Error('Builds must have NODE_ENV=production')
}

// Empty the build directory.
fs.emptyDirSync(BUILD_DIR)

var webpackConfig = {
  entry: path.resolve(SRC_DIR, './js/background.js'),
  output: {
    filename: 'background.js',
    path: path.resolve(BUILD_DIR, 'js')
  }
}

webpack(webpackConfig).run((err, stats) => {
  if (err) {
    console.log('Failed to compile.', err)
    process.exit(1)
  }
  console.log('Webpack JS build complete.')
})

// Copy other files.
fs.copySync(path.join(SRC_DIR, 'img'), path.join(BUILD_DIR, 'img'))

console.log('Copied shared files to intermediate build.')


var fs = require('fs-extra')
var path = require('path')

var SRC_DIR = path.join(__dirname, '../src/shared/')
var BUILD_DIR = path.join(__dirname, '../intermediate-builds/shared/')

if (process.env.NODE_ENV !== 'production') {
  throw new Error('Builds must have NODE_ENV=production')
}

// Empty the build directory.
fs.emptyDirSync(BUILD_DIR)

// Copy other files.
fs.copySync(path.join(SRC_DIR, 'img'), path.join(BUILD_DIR, 'img'))

console.log('Copied shared files to intermediate build.')

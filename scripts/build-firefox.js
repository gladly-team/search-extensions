/* eslint no-console: 0, import/no-extraneous-dependencies: 0, import/no-dynamic-require: 0 */

const fs = require('fs-extra')
const path = require('path')
const { execSync } = require('child_process')

const SRC_DIR = path.join(__dirname, '../src/firefox/')
const BUILD_DIR = path.join(__dirname, '../build/firefox/')
const INTERMEDIATE_BUILD_DIR = path.join(
  __dirname,
  '../intermediate-builds/firefox/'
)
const SHARED_CODE_BUILD_DIR = path.join(
  __dirname,
  '../intermediate-builds/shared/'
)

// Get the version number.
const manifest = require(path.join(SRC_DIR, 'manifest.json'))
const { version } = manifest
console.log(`Building extension version ${version}...`)

// Empty build target contents. This will also create the directory
// if it does not exist.
fs.emptyDirSync(BUILD_DIR)
fs.emptyDirSync(INTERMEDIATE_BUILD_DIR)

// Filter copying source files to build. Return true if we should copy and
// false if we should not.
const filterCopiedFiles = src => {
  const ignoredPaths = ['/tmp', '/__tests__']
  if (path.basename(src) === '.DS_Store') {
    return false
  }
  const containsIgnoredPath = ignoredPaths.some(ignoredPath => {
    return src.indexOf(ignoredPath) > -1
  })
  if (containsIgnoredPath) {
    return false
  }
  return true
}

console.log('Building intermediate extension for the addon store...')
fs.copySync(SRC_DIR, INTERMEDIATE_BUILD_DIR, { filter: filterCopiedFiles })

// Build the shared code and add it to the built extension.
execSync('yarn run shared:build')
fs.copySync(SHARED_CODE_BUILD_DIR, INTERMEDIATE_BUILD_DIR)

console.log('Making final extension build.')
execSync(
  `web-ext build --source-dir=${INTERMEDIATE_BUILD_DIR} -a ${BUILD_DIR} --overwrite-dest`
)

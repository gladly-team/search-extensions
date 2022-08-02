/* eslint no-console: 0, import/no-extraneous-dependencies: 0, import/no-dynamic-require: 0 */

const fs = require('fs-extra')
const path = require('path')
const { execSync } = require('child_process')
const archiver = require('archiver')

// In the future, could consider crx-hotreload script for better
// development experience:
// https://github.com/xpl/crx-hotreload/blob/master/hot-reload.js

const BASE_BUILD_DIR = path.join(__dirname, '../build/')
const SHARED_CODE_BUILD_DIR = path.join(
  __dirname,
  '../intermediate-builds/shared/'
)

// Require the caller to pass the browser name.
const CHROME_BROWSER = 'chrome'
const EDGE_BROWSER = 'edge'
const allowedBrowsers = [CHROME_BROWSER, EDGE_BROWSER]
const scriptArgs = process.argv.slice(2)
const buildTarget = scriptArgs[0]
if (allowedBrowsers.indexOf(buildTarget) < 0) {
  throw new Error('Specify either "chrome" or "edge" browser.')
}

const buildBrowser = browser => {
  process.env.BROWSER = browser
  let buildDirectory
  let sourceDirectory
  if (browser === CHROME_BROWSER) {
    buildDirectory = path.join(BASE_BUILD_DIR, 'chromium/')
    sourceDirectory = path.join(__dirname, '../src/chromium/')
  } else if (browser === EDGE_BROWSER) {
    buildDirectory = path.join(BASE_BUILD_DIR, 'edge/')
    sourceDirectory = path.join(__dirname, '../src/edge/')
  } else {
    throw new Error('Specify either "chrome" or "edge" browser.')
  }

  const manifest = require(path.join(sourceDirectory, 'manifest.json'))
  const { version } = manifest

  // Empty build target contents. This will also create the directory
  // if it does not exist.
  fs.emptyDirSync(buildDirectory)

  // Get the version number.
  console.log(`Building extension version ${version} for browser ${browser}...`)

  // Create the build version of the src.
  const stageDir = path.join(buildDirectory, `${browser}-search-for-a-cause`)

  // Filter copying source files to build. Return true if we should copy and
  // false if we should not.
  const filterCopiedFiles = src => {
    if (path.basename(src) === '.DS_Store') {
      return false
    }
    return true
  }
  fs.copySync(sourceDirectory, stageDir, { filter: filterCopiedFiles })
  fs.removeSync(path.join(stageDir, '__tests__'))

  // Build the shared code and add it to the built extension.
  execSync('yarn run shared:build')
  fs.copySync(SHARED_CODE_BUILD_DIR, stageDir)

  // Create zip file.
  const zipFileName = `${browser}-search-for-a-cause-v${version}.zip`
  const output = fs.createWriteStream(path.join(buildDirectory, zipFileName))
  const archive = archiver('zip')

  // Listen for all archive data to be written.
  output.on('close', () => {
    console.log(`${archive.pointer()} total bytes`)
    console.log('Finished building.')
  })

  archive.on('error', err => {
    throw err
  })

  // Pipe archive data to the file.
  archive.pipe(output)

  // Append all files in our src directory.
  archive.directory(stageDir, '/')

  // Finalize the archive (i.e. we are done appending files,
  // but streams still have to finish).
  archive.finalize()
}

buildBrowser(buildTarget)

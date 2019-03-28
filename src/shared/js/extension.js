/* eslint no-console: 0, no-empty: 0 */
/* globals chrome browser window */

// From:
// https://github.com/EmailThis/extension-boilerplate
const apis = [
  'alarms',
  'bookmarks',
  'browserAction',
  'commands',
  'contextMenus',
  'cookies',
  'downloads',
  'events',
  'extension',
  'extensionTypes',
  'history',
  'i18n',
  'idle',
  'notifications',
  'pageAction',
  'runtime',
  'storage',
  'tabs',
  'webNavigation',
  'webRequest',
  'windows',
]

function Extension() {
  const _this = this

  apis.forEach(api => {
    _this[api] = null

    try {
      if (chrome[api]) {
        _this[api] = chrome[api]
      }
    } catch (e) {}

    try {
      if (window[api]) {
        _this[api] = window[api]
      }
    } catch (e) {}

    try {
      if (browser[api]) {
        _this[api] = browser[api]
      }
    } catch (e) {}
    try {
      _this.api = browser.extension[api]
    } catch (e) {}
  })

  try {
    if (browser && browser.runtime) {
      this.runtime = browser.runtime
    }
  } catch (e) {
    console.error(e)
  }

  try {
    if (browser && browser.browserAction) {
      this.browserAction = browser.browserAction
    }
  } catch (e) {
    console.error(e)
  }
}

module.exports = new Extension()

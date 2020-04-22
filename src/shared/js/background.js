/* eslint no-console:0 */

import ext from './extension'
import config from './config'

// We cannot open a welcome page on install, because there's
// a bug in Firefox that will hide the confirmation dialog
// for changing the default search engine:
// https://bugzilla.mozilla.org/show_bug.cgi?id=1544271

// On uninstall, open a post-uninstall page to get feedback.
try {
  const postUninstallURL = 'https://tab.gladly.io/search/uninstalled/'
  ext.runtime.setUninstallURL(postUninstallURL)
} catch (e) {
  console.error(e)
}

// On browser icon click, make a random search.
try {
  ext.browserAction.onClicked.addListener(() => {
    try {
      // Add the browser to the search "src" parameter.
      const baseURL = 'https://tab.gladly.io/search/random/'
      let finalURL = baseURL
      if (config.browser === 'chrome') {
        finalURL = `${baseURL}?src=chrome`
      } else if (config.browser === 'firefox') {
        finalURL = `${baseURL}?src=ff`
      }
      ext.tabs.create({
        url: finalURL,
      })
    } catch (e) {
      console.error(e)
    }
  })
} catch (e) {
  console.error(e)
}

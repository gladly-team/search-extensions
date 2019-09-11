/* eslint no-console:0 */

import ext from './extension'
import config from './config'

// On install, open a welcome tab.
// https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/API/runtime/onInstalled
try {
  ext.runtime.onInstalled.addListener(details => {
    try {
      if (details.reason === ext.runtime.OnInstalledReason.INSTALL) {
        const postInstallURL = 'https://tab.gladly.io/search/first-search/'
        ext.tabs.create({ url: postInstallURL })
      }
    } catch (e) {
      console.error(e)
    }
  })
} catch (e) {
  console.error(e)
}

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

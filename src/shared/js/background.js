/* eslint no-console:0 */

import ext from './extension'

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

try {
  ext.browserAction.onClicked.addListener(() => {
    try {
      ext.tabs.create({ url: 'https://tab.gladly.io/search/random/' })
    } catch (e) {
      console.error(e)
    }
  })
} catch (e) {
  console.error(e)
}

// Firefox does not support externally_connectable:
// https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/manifest.json/externally_connectable
ext.runtime.onMessageExternal.addListener((request, sender, sendResponse) => {
  if (request) {
    if (request.message) {
      if (request.message === 'ping') {
        sendResponse({ installed: true })
      }
    }
  }
  return true
})

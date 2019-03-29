/* eslint no-console:0 */

import ext from './extension'

// TODO: update URLs for these pages before enabling.

// // On install, open a welcome tab.
// ext.runtime.onInstalled.addListener(object => {
//   try {
//     if (object.reason === ext.runtime.OnInstalledReason.INSTALL) {
//       const postInstallURL = 'https://tab.gladly.io/newtab/first-tab/'
//       ext.tabs.create({ url: postInstallURL })
//     }
//   } catch (e) {
//     console.error(e)
//   }
// })

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

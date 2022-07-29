/* eslint-env jest */

jest.mock('../extension')
jest.mock('../config', () => ({
  default: {
    browser: 'chrome',
  },
}))

afterEach(() => {
  jest.clearAllMocks()
  jest.resetModules()
})

// Note: we partially mock the browser APIs in setupTests.js.

describe('background script: open tab after uninstall', () => {
  it('sets the post-uninstall URL', () => {
    const ext = require('../extension')
    require('../background')
    expect(ext.runtime.setUninstallURL).toHaveBeenCalledWith(
      'https://tab.gladly.io/search/uninstalled/'
    )
  })

  it('gracefully handles errors with setting the post-uninstall URL', () => {
    const ext = require('../extension')
    ext.runtime.setUninstallURL.mockImplementationOnce(() => {
      throw new Error('Whoops!')
    })

    // Suppress expected console error.
    jest.spyOn(console, 'error').mockImplementationOnce(() => {})

    // Should not throw.
    require('../background')
  })
})

describe('background script: open search on extension icon click', () => {
  it('opens a tab to search on extension icon click', () => {
    const ext = require('../extension')
    require('../background')
    const callback = ext.browserAction.onClicked.addListener.mock.calls[0][0]
    callback({
      id: 'some-tab-id',
    })
    expect(ext.tabs.create).toHaveBeenCalledWith({
      url: expect.any(String),
    })
  })

  it('does not set the "src" URL param value when the browser is not defined', () => {
    const config = require('../config').default
    config.browser = undefined
    const ext = require('../extension')
    require('../background')
    const callback = ext.browserAction.onClicked.addListener.mock.calls[0][0]
    callback({
      id: 'some-tab-id',
    })
    expect(ext.tabs.create).toHaveBeenCalledWith({
      url: 'https://tab.gladly.io/search/random/',
    })
  })

  it('sets the "src" URL param value to "chrome" when it is the Chrome extension', () => {
    const config = require('../config')
    config.browser = 'chrome'
    const ext = require('../extension')
    require('../background')
    const callback = ext.browserAction.onClicked.addListener.mock.calls[0][0]
    callback({
      id: 'some-tab-id',
    })
    expect(ext.tabs.create).toHaveBeenCalledWith({
      url: 'https://tab.gladly.io/search/random/?src=chrome',
    })
  })

  it('sets the "src" URL param value to "edge" when it is the Edge extension', () => {
    const config = require('../config')
    config.browser = 'edge'
    const ext = require('../extension')
    require('../background')
    const callback = ext.browserAction.onClicked.addListener.mock.calls[0][0]
    callback({
      id: 'some-tab-id',
    })
    expect(ext.tabs.create).toHaveBeenCalledWith({
      url: 'https://tab.gladly.io/search/random/?src=edge',
    })
  })

  it('sets the "src" URL param value to "ff" when it is the Firefox extension', () => {
    const config = require('../config')
    config.browser = 'firefox'
    const ext = require('../extension')
    require('../background')
    const callback = ext.browserAction.onClicked.addListener.mock.calls[0][0]
    callback({
      id: 'some-tab-id',
    })
    expect(ext.tabs.create).toHaveBeenCalledWith({
      url: 'https://tab.gladly.io/search/random/?src=ff',
    })
  })

  it('does not set the "src" URL param value when it is invalid', () => {
    const config = require('../config')
    config.browser = 'foobar'
    const ext = require('../extension')
    require('../background')
    const callback = ext.browserAction.onClicked.addListener.mock.calls[0][0]
    callback({
      id: 'some-tab-id',
    })
    expect(ext.tabs.create).toHaveBeenCalledWith({
      url: 'https://tab.gladly.io/search/random/',
    })
  })

  it('gracefully handles any error when adding a listener for the extension icon click', () => {
    const ext = require('../extension')
    ext.browserAction.onClicked.addListener.mockImplementationOnce(() => {
      throw new Error('Whoops!')
    })

    // Suppress expected console error.
    jest.spyOn(console, 'error').mockImplementationOnce(() => {})

    // Should not throw.
    require('../background')
  })

  it('gracefully handles any error when opening a tab on extension icon click', () => {
    const ext = require('../extension')
    require('../background')

    ext.tabs.create.mockImplementationOnce(() => {
      throw new Error('Whoops!')
    })

    // Suppress expected console error.
    jest.spyOn(console, 'error').mockImplementationOnce(() => {})

    const callback = ext.browserAction.onClicked.addListener.mock.calls[0][0]
    callback({
      id: 'some-tab-id',
    })
  })
})

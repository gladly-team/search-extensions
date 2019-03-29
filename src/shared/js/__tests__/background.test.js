/* eslint-env jest */

jest.mock('../extension')

afterEach(() => {
  jest.clearAllMocks()
  jest.resetModules()
})

// Note: we partially mock the browser APIs in setupTests.js.

describe('background script', () => {
  it('is a nice placeholder test', () => {
    expect(true).toBe(true)
  })

  // it('opens a welcome tab on install', () => {
  //   const ext = require('../extension')
  //   require('../background')

  //   // Mock the onInstalled event
  //   const onInstalledCallback = ext.runtime.onInstalled.addListener.mock.calls[0][0]
  //   onInstalledCallback({
  //     reason: 'install',
  //     id: 'abc-123'
  //   })
  //   expect(ext.tabs.create).toHaveBeenCalledWith({
  //     url: 'https://tab.gladly.io/newtab/first-tab/'
  //   })
  // })

  // it('does not open a tab on extension update', () => {
  //   const ext = require('../extension')
  //   require('../background')

  //   // Mock the onInstalled event
  //   const onInstalledCallback = ext.runtime.onInstalled.addListener.mock.calls[0][0]
  //   onInstalledCallback({
  //     reason: 'update',
  //     previousVersion: '1.6'
  //   })
  //   expect(ext.tabs.create).not.toHaveBeenCalled()
  // })

  // it('gracefully handles any error with opening the welcome page', () => {
  //   const ext = require('../extension')
  //   require('../background')

  //   ext.tabs.create.mockImplementationOnce(() => {
  //     throw new Error('Whoops!')
  //   })

  //   // Suppress expected console error.
  //   jest.spyOn(console, 'error').mockImplementationOnce(() => {})

  //   // Mock the onInstalled event
  //   const onInstalledCallback = ext.runtime.onInstalled.addListener.mock.calls[0][0]
  //   onInstalledCallback({
  //     reason: 'install'
  //   })
  // })

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

  it('opens a tab to search on extension icon click', () => {
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

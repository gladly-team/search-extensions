/* eslint-env jest */

jest.mock('../extension')

afterEach(() => {
  jest.clearAllMocks()
  jest.resetModules()
})

describe('background script', () => {
  it('opens a welcome tab on install', () => {
    const ext = require('../extension')
    require('../background')

    // Mock the onInstalled event
    const onInstalledCallback = ext.runtime.onInstalled.addListener.mock.calls[0][0]
    onInstalledCallback({
      reason: 'install',
      id: 'abc-123'
    })
    expect(ext.tabs.create).toHaveBeenCalledWith({
      url: 'https://tab.gladly.io/newtab/first-tab/'
    })
  })

  it('does not open a tab on extension update', () => {
    const ext = require('../extension')
    require('../background')

    // Mock the onInstalled event
    const onInstalledCallback = ext.runtime.onInstalled.addListener.mock.calls[0][0]
    onInstalledCallback({
      reason: 'update',
      previousVersion: '1.6'
    })
    expect(ext.tabs.create).not.toHaveBeenCalled()
  })

  it('gracefully handles any error with opening the welcome page', () => {
    const ext = require('../extension')
    require('../background')

    ext.tabs.create.mockImplementationOnce(() => {
      throw new Error('Whoops!')
    })

    // Suppress expected console error.
    jest.spyOn(console, 'error').mockImplementationOnce(() => {})

    // Mock the onInstalled event
    const onInstalledCallback = ext.runtime.onInstalled.addListener.mock.calls[0][0]
    onInstalledCallback({
      reason: 'install'
    })
  })

  it('sets the post-uninstall URL', () => {
    const ext = require('../extension')
    require('../background')
    expect(ext.runtime.setUninstallURL)
      .toHaveBeenCalledWith('https://tab.gladly.io/newtab/uninstalled/')
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

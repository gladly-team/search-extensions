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

describe('background script: open tab on install', () => {
  it('sets a listener for the onInstalled event', () => {
    const ext = require('../extension')
    require('../background')
    expect(ext.runtime.onInstalled.addListener).toHaveBeenCalled()
  })

  it('opens the welcome page after install', () => {
    const ext = require('../extension')
    require('../background')
    const handler = ext.runtime.onInstalled.addListener.mock.calls[0][0]
    handler({ reason: 'install' })
    expect(ext.tabs.create).toHaveBeenCalledWith({
      url: 'https://tab.gladly.io/search/first-search/',
    })
  })

  it('does not open a welcome page after extension update', () => {
    const ext = require('../extension')
    require('../background')
    const handler = ext.runtime.onInstalled.addListener.mock.calls[0][0]
    handler({ reason: 'update' })
    expect(ext.tabs.create).not.toHaveBeenCalled()
  })

  it('gracefully handles errors with setting the onInstalled listener', () => {
    const ext = require('../extension')
    ext.runtime.onInstalled.addListener.mockImplementationOnce(() => {
      throw new Error('Whoops!')
    })

    // Suppress expected console error.
    jest.spyOn(console, 'error').mockImplementationOnce(() => {})

    // Should not throw.
    require('../background')
  })

  it('gracefully handles errors when opening the welcome page tab', () => {
    const ext = require('../extension')
    require('../background')
    ext.tabs.create.mockImplementationOnce(() => {
      throw new Error('Whoops!')
    })

    // Suppress expected console error.
    jest.spyOn(console, 'error').mockImplementationOnce(() => {})

    const handler = ext.runtime.onInstalled.addListener.mock.calls[0][0]

    // Should not throw.
    handler({ reason: 'install' })
  })
})

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

describe('background script: handle external messages', () => {
  it('sets a listener for the onMessageExternal event', () => {
    const ext = require('../extension')
    require('../background')
    expect(ext.runtime.onMessageExternal.addListener).toHaveBeenCalled()
  })

  it('returns true from the addListener handler', () => {
    const ext = require('../extension')
    require('../background')
    const handler = ext.runtime.onMessageExternal.addListener.mock.calls[0][0]
    expect(handler()).toBe(true)
  })

  it('sends a response to message="ping"', () => {
    const ext = require('../extension')
    require('../background')
    const handler = ext.runtime.onMessageExternal.addListener.mock.calls[0][0]
    const mockSendResponse = jest.fn()
    handler({ message: 'ping' }, {}, mockSendResponse)
    expect(mockSendResponse).toHaveBeenCalledWith({ installed: true })
  })

  it("sends an empty response to a message we don't support", () => {
    const ext = require('../extension')
    require('../background')
    const handler = ext.runtime.onMessageExternal.addListener.mock.calls[0][0]
    const mockSendResponse = jest.fn()
    handler({ message: 'total-nonsense' }, {}, mockSendResponse)
    expect(mockSendResponse).toHaveBeenCalledTimes(1)
    expect(mockSendResponse.mock.calls[0][0]).toBeUndefined()
  })

  it('gracefully handles errors with setting the onInstalled listener', () => {
    const ext = require('../extension')
    ext.runtime.onMessageExternal.addListener.mockImplementationOnce(() => {
      throw new Error('Whoops!')
    })

    // Suppress expected console error.
    jest.spyOn(console, 'error').mockImplementationOnce(() => {})

    // Should not throw.
    require('../background')
  })
})

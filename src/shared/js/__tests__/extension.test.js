/* eslint-env jest */

// jest.mock('../extension')

afterEach(() => {
  jest.clearAllMocks()
  jest.resetModules()
})

describe('shared extension API', () => {
  it('works when the `chrome` global is present', () => {
    // Mock a portion of the Chrome Extension API.
    global.chrome = {
      runtime: {
        onInstalled: {
          addListener: jest.fn(),
        },
        OnInstalledReason: {
          INSTALL: 'install',
          UPDATE: 'update',
          CHROME_UPDATE: 'chrome_update',
          SHARED_MODULE_UPDATE: 'shared_module_update',
        },
        setUninstallURL: jest.fn(),
      },
      tabs: {
        create: jest.fn(),
      },
    }

    // This is not Firefox.
    global.browser = undefined

    const ext = require('../extension')

    ext.tabs.create({
      url: 'https://example.com/foo/',
    })
    expect(global.chrome.tabs.create).toHaveBeenCalledWith({
      url: 'https://example.com/foo/',
    })
  })

  it('works when the Firefox `browser` global is present', () => {
    // Mock a portion of the Chrome Extension API.
    global.browser = {
      runtime: {
        onInstalled: {
          addListener: jest.fn(),
        },
        OnInstalledReason: {
          INSTALL: 'install',
          UPDATE: 'update',
          CHROME_UPDATE: 'chrome_update',
          SHARED_MODULE_UPDATE: 'shared_module_update',
        },
        setUninstallURL: jest.fn(),
      },
      tabs: {
        create: jest.fn(),
      },
    }

    // This is not Chrome.
    global.chrome = undefined

    const ext = require('../extension')

    ext.tabs.create({
      url: 'https://example.com/foo/',
    })
    expect(global.browser.tabs.create).toHaveBeenCalledWith({
      url: 'https://example.com/foo/',
    })
  })
})

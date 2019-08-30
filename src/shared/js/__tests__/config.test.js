/* eslint-env jest */

jest.mock('../extension')

afterEach(() => {
  jest.resetModules()
})

describe('config', () => {
  it('throws an error if process.env.BROWSER is not set', () => {
    delete process.env.BROWSER
    expect(() => require('../config').default).toThrow(
      'The environment variable process.env.BROWSER must be set.'
    )
  })

  it('does not throw an error if process.env.BROWSER is  set', () => {
    process.env.BROWSER = 'chrome'
    expect(() => require('../config').default).not.toThrow()
  })

  it('throws an error if process.env.BROWSER is set to an invalid value', () => {
    process.env.BROWSER = 'blackberry-browser'
    expect(() => require('../config').default).toThrow(
      'The environment variable process.env.BROWSER must be one of: "chrome", "firefox"'
    )
  })

  it('returns the expected "browser" value when set to chrome', () => {
    process.env.BROWSER = 'chrome'
    const config = require('../config').default
    expect(config.browser).toEqual('chrome')
  })

  it('returns the expected "browser" value when set to firefox', () => {
    process.env.BROWSER = 'firefox'
    const config = require('../config').default
    expect(config.browser).toEqual('firefox')
  })
})

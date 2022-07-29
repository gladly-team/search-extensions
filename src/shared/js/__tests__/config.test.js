/* eslint-env jest */

jest.mock('../extension')

afterEach(() => {
  delete process.env.BROWSER
  jest.resetModules()
})

describe('config', () => {
  it('returns the expected "browser" value when process.env.BROWSER is not defined', () => {
    delete process.env.BROWSER
    const config = require('../config').default
    expect(config.browser).toBeUndefined()
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

  it('returns the expected "browser" value when set to edge', () => {
    process.env.BROWSER = 'edge'
    const config = require('../config').default
    expect(config.browser).toEqual('edge')
  })
})

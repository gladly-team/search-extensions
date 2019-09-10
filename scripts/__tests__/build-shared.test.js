/* eslint-env jest */

jest.mock('fs-extra')
jest.mock('path')

const mockWebpack = jest.fn(() => ({
  run: jest.fn(),
}))
mockWebpack.DefinePlugin = jest.fn()
jest.mock('webpack', () => mockWebpack)

beforeEach(() => {
  process.env.NODE_ENV = 'production'

  // Suppress console logs.
  jest.spyOn(console, 'log').mockImplementation(() => {})
})

afterEach(() => {
  delete process.env.BROWSER
  jest.resetModules()
})

describe('config', () => {
  it('does not throw an error if process.env.BROWSER is set', () => {
    process.env.BROWSER = 'chrome'
    expect(() => require('../build-shared')).not.toThrow()
  })

  it('throws an error if process.env.BROWSER is set to an invalid value', () => {
    process.env.BROWSER = 'blackberry-browser'
    expect(() => require('../build-shared')).toThrow(
      'The environment variable process.env.BROWSER must be one of: "chrome", "firefox". Received: "blackberry-browser"'
    )
  })
})

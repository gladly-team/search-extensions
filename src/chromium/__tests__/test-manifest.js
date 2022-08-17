/* eslint-env jest */

import qs from 'qs'

const manifest = require('../manifest.json')

// Tests to avoid accidentally requesting new permissions.
// https://developer.chrome.com/extensions/permission_warnings

test('manifest permissions have not changed', () => {
  const { permissions } = manifest
  expect(permissions).toEqual([])
})

test('content script permissions have not changed', () => {
  expect(manifest.content_scripts).toBeUndefined()
})

test('manifest does not extend devtools', () => {
  expect(manifest.devtools_page).toBeUndefined()
})

test('manifest does not use plugins', () => {
  expect(manifest.plugins).toBeUndefined()
})

test('only overrides search settings', () => {
  expect(Object.keys(manifest.chrome_settings_overrides)).toEqual([
    'search_provider',
  ])
})

// This requires new permissions, unfortunately, and will disable
// the extension for existing users.
test('manifest does not declare externally_connectable', () => {
  expect(manifest.externally_connectable).toBeUndefined()
})

// Search settings tests.

test('search name is as expected', () => {
  expect(manifest.chrome_settings_overrides.search_provider.name).toEqual(
    'Search for a Cause'
  )
})

test('search URL uses the expected origin', () => {
  const searchURL =
    manifest.chrome_settings_overrides.search_provider.search_url
  const searchURLPlaceholderRemoved = searchURL.replace(
    '{searchTerms}',
    'hello'
  )
  const { origin } = new URL(searchURLPlaceholderRemoved)
  expect(origin).toEqual('https://tab.gladly.io')
})

test('search URL has the expected page pathname', () => {
  const searchURL =
    manifest.chrome_settings_overrides.search_provider.search_url
  const searchURLPlaceholderRemoved = searchURL.replace(
    '{searchTerms}',
    'hello'
  )
  const { pathname } = new URL(searchURLPlaceholderRemoved)
  expect(pathname).toEqual('/search')
})

test('search URL includes the "q" parameter with a value of the search query', () => {
  const searchURL =
    manifest.chrome_settings_overrides.search_provider.search_url
  const searchURLPlaceholderRemoved = searchURL.replace(
    '{searchTerms}',
    'hello'
  )
  const { search } = new URL(searchURLPlaceholderRemoved)
  expect(qs.parse(search, { ignoreQueryPrefix: true }).q).toEqual('hello')
})

test('search URL includes the "src" parameter with a value of "chrome"', () => {
  const searchURL =
    manifest.chrome_settings_overrides.search_provider.search_url
  const searchURLPlaceholderRemoved = searchURL.replace(
    '{searchTerms}',
    'hello'
  )
  const { search } = new URL(searchURLPlaceholderRemoved)
  expect(qs.parse(search, { ignoreQueryPrefix: true }).src).toEqual('chrome')
})

// Browser action tests.

test('browser action display name is as expected', () => {
  expect(manifest.action.default_title).toEqual('Search for a Cause')
})

test('browser action default icons match extension icons', () => {
  expect(manifest.action.default_icon).toEqual(manifest.icons)
})

// Basic display tests.

test('extension name is correct', () => {
  expect(manifest.name).toBe('Search for a Cause')
})

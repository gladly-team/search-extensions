/* eslint-env jest */

import qs from 'qs'

const manifest = require('../manifest.json')

// Tests to avoid accidentally requesting new permissions.

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

test('manifest applications are as expected', () => {
  expect(manifest.applications).toEqual({
    gecko: {
      strict_min_version: '56.0a1',
    },
  })
})

test('only overrides search settings', () => {
  expect(Object.keys(manifest.chrome_settings_overrides)).toEqual([
    'search_provider',
  ])
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
  expect(origin).toEqual('https://search.yahoo.com')
})

test('search URL has the expected page pathname', () => {
  const searchURL =
    manifest.chrome_settings_overrides.search_provider.search_url
  const searchURLPlaceholderRemoved = searchURL.replace(
    '{searchTerms}',
    'hello'
  )
  const { pathname } = new URL(searchURLPlaceholderRemoved)
  expect(pathname).toEqual('/yhs/search')
})

test('search URL includes the "p" parameter with a value of the search query', () => {
  const searchURL =
    manifest.chrome_settings_overrides.search_provider.search_url
  const searchURLPlaceholderRemoved = searchURL.replace(
    '{searchTerms}',
    'hello'
  )
  const { search } = new URL(searchURLPlaceholderRemoved)
  expect(qs.parse(search, { ignoreQueryPrefix: true }).p).toEqual('hello')
})

test('search URL includes the "hspart" parameter with a value of "gladly"', () => {
  const searchURL =
    manifest.chrome_settings_overrides.search_provider.search_url
  const searchURLPlaceholderRemoved = searchURL.replace(
    '{searchTerms}',
    'hello'
  )
  const { search } = new URL(searchURLPlaceholderRemoved)
  expect(qs.parse(search, { ignoreQueryPrefix: true }).hspart).toEqual('gladly')
})

test('search URL includes the "hsimp" parameter with a value of "yhs-001"', () => {
  const searchURL =
    manifest.chrome_settings_overrides.search_provider.search_url
  const searchURLPlaceholderRemoved = searchURL.replace(
    '{searchTerms}',
    'hello'
  )
  const { search } = new URL(searchURLPlaceholderRemoved)
  expect(qs.parse(search, { ignoreQueryPrefix: true }).hspart).toEqual('gladly')
})

test('search URL includes the "type" parameter with a value of "src_ff.c_none.r_none"', () => {
  const searchURL =
    manifest.chrome_settings_overrides.search_provider.search_url
  const searchURLPlaceholderRemoved = searchURL.replace(
    '{searchTerms}',
    'hello'
  )
  const { search } = new URL(searchURLPlaceholderRemoved)
  expect(qs.parse(search, { ignoreQueryPrefix: true }).type).toEqual(
    'src_ff.c_none.r_none'
  )
})

// Browser action tests.

test('browser action display name is as expected', () => {
  expect(manifest.browser_action.default_title).toEqual('Search for a Cause')
})

test('browser action default icons match extension icons', () => {
  expect(manifest.browser_action.default_icon).toEqual(manifest.icons)
})

// Basic display tests.

test('extension name is correct', () => {
  expect(manifest.name).toBe('Search for a Cause')
})

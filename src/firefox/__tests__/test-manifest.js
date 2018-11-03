/* eslint-env jest */

const manifest = require('../manifest.json')

// Tests to avoid accidentally requesting new permissions.

test('manifest permissions have not changed', () => {
  var permissions = manifest['permissions']
  expect(permissions).toEqual(['tabs'])
})

test('content script permissions have not changed', () => {
  expect(manifest['content_scripts']).toBeUndefined()
})

test('manifest does not extend devtools', () => {
  expect(manifest['devtools_page']).toBeUndefined()
})

test('manifest does not use plugins', () => {
  expect(manifest['plugins']).toBeUndefined()
})

test('manifest applications are as expected', () => {
  expect(manifest['applications']).toEqual({
    'gecko': {
      'strict_min_version': '56.0a1'
    }
  })
})

test('only overrides search settings', () => {
  expect(Object.keys(manifest['chrome_settings_overrides']))
    .toEqual(['search_provider'])
})

test('search name is as expected', () => {
  expect(
    manifest['chrome_settings_overrides']['search_provider']['name'])
    .toEqual('Search for a Cause')
})

// Basic display tests.

test('extension name is correct', () => {
  expect(manifest['name']).toBe('Search for a Cause')
})

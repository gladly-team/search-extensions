const browserName = process.env.BROWSER
if (!browserName) {
  throw new Error('The environment variable process.env.BROWSER must be set.')
}
if (['chrome', 'firefox'].indexOf(browserName) < 0) {
  throw new Error(
    `The environment variable process.env.BROWSER must be one of: "chrome", "firefox". Received: "${browserName}".`
  )
}

export default {
  browser: browserName,
}

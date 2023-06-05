function getProxyConfig () {
  return {
    '/api': {
      target: 'http://127.0.0.1:9502',
      secure: false,
      changeOrigin: true
    }
  }
}

module.exports = getProxyConfig

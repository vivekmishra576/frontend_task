const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function(app) {
  app.use(
    '/api',
    createProxyMiddleware({
      target: 'https://admin-moderator-backend-staging.up.railway.app',
      changeOrigin: true,
      secure: false,
      logLevel: 'debug'
    })
  );
};

const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function(app) {
  app.use(
    '/api',
    createProxyMiddleware({
      target: 'http://quotes.stormconsultancy.co.uk',
      changeOrigin: true,
      pathRewrite: {
        '^/api': '',
      },
    })
  );
};

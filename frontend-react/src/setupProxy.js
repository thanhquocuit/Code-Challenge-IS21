const { createProxyMiddleware } = require("http-proxy-middleware");

module.exports = function (app) {
  app.use(
    "/api/*",
    createProxyMiddleware({
      target: "http://localhost:3067",
      changeOrigin: true,
    })
  );

  /*
  app.use(
    createProxyMiddleware("/api/ws", {
      target: "http://localhost:5000",
      changeOrigin: true,
      ws: true,
    })
  );
  
  app.use(
    "//",
    createProxyMiddleware({
      target: "http://localhost:5000",
      changeOrigin: true,
    })
  );
  app.use(function (req, res, next) {
    switch (req.path) {
      case "/unity/chess3dunity.data.gz":
      case "/unity/chess3dunity.framework.js.gz":
        res.setHeader("Content-Encoding", "gzip");
        break;
      case "/unity/chess3dunity.wasm.gz":
        res.setHeader("Content-Encoding", "gzip");
        res.setHeader("Content-Type", "application/wasm");
        break;
      default:
        break;
    }

    next();
  });
  */
};

"use strict";

const port = process.env.port || process.env.npm_config_port || 9528; // dev port

module.exports = {
  publicPath: "./",
  assetsDir: "static",
  //lintOnSave: process.env.NODE_ENV === "development",
  lintOnSave: false,
  productionSourceMap: false,
  devServer: {
    port: port,
    open: true,
    overlay: {
      warnings: false,
      errors: true,
    },
    proxy: {
      "/api": {
        target: "http://47.111.144.121:3000", //对应自己的接口
        changeOrigin: true,
        ws: true,
        pathRewrite: {
          "^/api": "",
        },
      },
    },
  },
};

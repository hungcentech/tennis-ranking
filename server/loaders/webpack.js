// -----------------------------------------------------------------------------

import logger from "../logger";
import config from "../config";

// -----------------------------------------------------------------------------

export default async app => {
  try {
    if (config.webpack.env == "development") {
      logger.info("loaders.wpk(): -- Loading Webpack... --------");

      const webpack = require("webpack");
      const webpackDevMiddleware = require("webpack-dev-middleware");
      const webpackHotMiddleware = require("webpack-hot-middleware");
      const webpackConfig = require("../../webpack.config.js");

      webpackConfig.mode = "development";
      webpackConfig.entry.app.push("webpack-hot-middleware/client", "webpack/hot/only-dev-server");
      webpackConfig.plugins.push(new webpack.HotModuleReplacementPlugin());

      const bundler = webpack(webpackConfig);
      app.use(webpackDevMiddleware(bundler, { noInfo: true }));
      app.use(webpackHotMiddleware(bundler, { log: console.log }));

      logger.info("loaders.wpk(): -- Webpack loaded ! ----------");
    }
  } catch (err) {
    logger.warn("loaders.wp(): Error: " + JSON.stringify(err));
    throw err;
  }
};

// -----------------------------------------------------------------------------

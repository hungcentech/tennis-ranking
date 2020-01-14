// -----------------------------------------------------------------------------

import SourceMapSupport from "source-map-support";
SourceMapSupport.install();

import logger from "./logger";
import config from "./conf";

import http from "http";
import express from "express";

import loaders from "./loaders";

// -----------------------------------------------------------------------------

async function start() {
  try {
    const app = express();
    await loaders(app);

    http
      .createServer(app)
      .on("listening", () => {
        logger.info("=============================================");
        logger.info(`Server start SUCCESS. Listening on port: ${config.port}`);
        logger.info("=============================================");
      })
      .listen(config.port);
  } catch (err) {
    logger.warn("!!! Server start failed !!! " + JSON.stringify(err));
    process.exit(1);
  }
}

// -------------------------------------

start();

// -----------------------------------------------------------------------------

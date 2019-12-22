// -----------------------------------------------------------------------------

import logger from "../logger";
import config from "../config";

import express from "express";
import bodyParser from "body-parser";

import apiLoader from "../api";

// -----------------------------------------------------------------------------

export default async (db, app) => {
  try {
    logger.info("loaders/exp(): -- Loading Express... --------");

    await app.use(express.static("./static"));
    await app.use(bodyParser.json());
    await app.set("json spaces", 2);

    await apiLoader(db, app);

    logger.info("loaders/exp(): -- Express loaded ! ----------");
    return app;
    //
  } catch (err) {
    logger.warn("loaders/exp(): Error: " + JSON.stringify(err));
    throw err;
  }

  // -----------------------------------------------------------------------------
};

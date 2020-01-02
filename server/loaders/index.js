// -----------------------------------------------------------------------------

import logger from "../logger";
import webpackLoader from "./webpack";
import dbLoader from "./db";
import expressLoader from "./express";

// -----------------------------------------------------------------------------

export default async app => {
  try {
    // Webpack for development
    await webpackLoader(app);

    // DB connection
    const db = await dbLoader();

    // Express app
    await expressLoader(db, app);

    // Let go!
  } catch (err) {
    logger.warn("loaders(): Error: " + JSON.stringify(err));
    throw err;
  }
};

// -----------------------------------------------------------------------------

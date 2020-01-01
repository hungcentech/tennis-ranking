// -----------------------------------------------------------------------------

import logger from "../logger";
import config from "../config";

import path from "path";

import playerApiLoader from "../api/player";
import matchApiLoader from "../api/match";

// -----------------------------------------------------------------------------

export default async (db, app) => {
  try {
    logger.info("api(): ------------ Loading APIs... ---------");

    await playerApiLoader(db, app);
    await matchApiLoader(db, app);

    logger.info("api(): ------------ APIs loaded ! -----------");
  } catch (err) {
    logger.warn("api(): Error: " + JSON.stringify(err));
    throw err;
  }
};

// -----------------------------------------------------------------------------

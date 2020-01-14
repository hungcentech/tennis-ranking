// -----------------------------------------------------------------------------

import "babel-polyfill";
import logger from "../../logger";

import api_create from "./create";
import api_read from "./read";
import api_update from "./update";

// -----------------------------------------------------------------------------

export default async (db, app) => {
  try {
    logger.info("api/match(): -------- match api... ----------");

    await api_create(db, app);
    await api_read(db, app);
    await api_update(db, app);

    logger.info("api/match(): -------- match api loaded ------");
  } catch (err) {
    logger.warn("api/match(): Error: " + JSON.stringify(err));
    throw err;
  }
};

// -----------------------------------------------------------------------------

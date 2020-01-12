// -----------------------------------------------------------------------------

import "babel-polyfill";
import logger from "../../logger";

import api_create from "./create";
import api_read from "./read";
import api_update from "./update";
import api_delete from "./delete";

// -----------------------------------------------------------------------------

export default async (db, app) => {
  try {
    logger.info("api.club(): --------- club api... -----------");

    await api_create(db, app);
    await api_read(db, app);
    await api_update(db, app);
    await api_delete(db, app);

    logger.info("api.club(): --------- club api loaded -------");
  } catch (err) {
    logger.warn("api.club(): Error: " + JSON.stringify(err));
    throw err;
  }
};

// -----------------------------------------------------------------------------

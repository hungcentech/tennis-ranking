// -----------------------------------------------------------------------------

import "babel-polyfill";
import logger from "../../logger";
import config from "../../config";

import api_create from "./create";
import api_read from "./read";
import api_update from "./update";
import api_delete from "./delete";

// -----------------------------------------------------------------------------

export default async (db, app) => {
  try {
    logger.info("api/match(): -------- match api... ----------");

    await api_create(db, app);
    await api_read(db, app);
    await api_update(db, app);
    await api_delete(db, app);

    // await db
    //   .collection("matches")
    //   .find()
    //   .toArray()
    //   .then(recs => {
    //     logger.info("api.match(): DB test:");
    //     logger.info("api.match(): " + JSON.stringify(recs));
    //   });

    logger.info("api/match(): -------- match api loaded ------");
  } catch (err) {
    logger.warn("api/match(): Error: " + JSON.stringify(err));
    throw err;
  }
};

// -----------------------------------------------------------------------------

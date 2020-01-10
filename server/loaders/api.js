// -----------------------------------------------------------------------------

import logger from "../logger";
import clubsApiLoader from "../api/clubs";
import playersApiLoader from "../api/players";
import matchesApiLoader from "../api/matches";

// -----------------------------------------------------------------------------

export default async (db, app) => {
  try {
    logger.info("api(): ------------ Loading APIs... ---------");

    await clubsApiLoader(db, app);
    // await playersApiLoader(db, app);
    // await matchesApiLoader(db, app);

    logger.info("api(): ------------ APIs loaded ! -----------");
  } catch (err) {
    logger.warn("api(): Error: " + JSON.stringify(err));
    throw err;
  }
};

// -----------------------------------------------------------------------------

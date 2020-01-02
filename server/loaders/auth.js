// -----------------------------------------------------------------------------

import logger from "../logger";
import facebookAuthLoader from "../auth/facebook";

// -----------------------------------------------------------------------------

export default async (db, app) => {
  try {
    logger.info("auth(): ----------- Loading Auth... ---------");

    await facebookAuthLoader(db, app);

    logger.info("auth(): ----------- Auth loaded ! -----------");
  } catch (err) {
    logger.warn("auth(): Error: " + JSON.stringify(err));
    throw err;
  }
};

// -----------------------------------------------------------------------------

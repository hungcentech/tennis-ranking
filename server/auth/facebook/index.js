// -----------------------------------------------------------------------------

import "babel-polyfill";

import logger from "../../logger";
import facebook_auth_login from "./login";
import facebook_auth_logout from "./logout";
import facebook_auth_data_delete from "./data_delete";

import passport from "passport";

// -----------------------------------------------------------------------------

export default async (db, app) => {
  try {
    logger.info("auth/facebook(): ---- facebook auth... ------");

    await app.use(passport.initialize());
    await app.use(passport.session());

    await facebook_auth_login(db, app, passport);
    // await facebook_auth_logout(db, app, passport);
    // await facebook_auth_data_delete(db, app, passport);

    logger.info("auth/facebook(): ---- facebook auth loaded --");
  } catch (err) {
    logger.warn("auth/facebook(): Error: " + JSON.stringify(err));
    throw err;
  }
};

// -----------------------------------------------------------------------------

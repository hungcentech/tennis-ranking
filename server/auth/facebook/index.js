// -----------------------------------------------------------------------------

import "babel-polyfill";

import logger from "../../logger";
import facebook_auth_login from "./login";

import passport from "passport";

// -----------------------------------------------------------------------------

export default async (db, app) => {
  try {
    logger.info("auth.facebook(): ---- facebook auth... ------");

    await app.use(passport.initialize());
    await app.use(passport.session());

    await facebook_auth_login(db, app, passport);

    logger.info("auth.facebook(): ---- facebook auth loaded --");
  } catch (err) {
    logger.warn(`auth.facebook(): ${err}`);
    throw err;
  }
};

// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------

import { Strategy as FacebookStrategy } from "passport-facebook";

import logger from "../../logger";
import config from "../../config";

// -----------------------------------------------------------------------------

export default async (db, app, passport) => {
  var user = {};

  // -------------------------------------

  passport.serializeUser(function(user, cb) {
    cb(null, user);
  });

  passport.deserializeUser(function(user, cb) {
    cb(null, user);
  });

  await passport.use(
    new FacebookStrategy(
      {
        clientID: config.auth.facebook.clientId,
        clientSecret: config.auth.facebook.clientSecret,
        callbackURL: config.auth.facebook.loginCallbackURL
      },
      (accessToken, refreshToken, profile, cb) => {
        try {
          user = {
            accessToken: accessToken,
            expireDate: new Date(new Date().getTime() + 30 * 60 * 1000),
            refreshToken: refreshToken,
            profile: profile
          };
          logger.debug("authFacebookLoginCb(): user = " + JSON.stringify(user));

          return cb(null, profile);
        } catch (err) {
          return cb(err);
        }
      }
    )
  );

  // -------------------------------------

  app.get("/auth/facebook/login", passport.authenticate("facebook", { scope: [] }));

  // -------------------------------------

  app.get(
    "/auth/facebook/cb/login",
    passport.authenticate("facebook", {
      successRedirect: "https://bme.hust.edu.vn/tennisrankings/auth/facebook/cb/login/success",
      failureRedirect: "https://bme.hust.edu.vn/tennisrankings/auth/facebook/cb/login/failed"
    })
  );

  // -------------------------------------

  app.get("/auth/facebook/cb/login/success", (req, res) => {
    logger.debug("/auth/facebook/cb/login/success: req.user = " + JSON.stringify(req.user));
    logger.debug("/auth/facebook/cb/login/success: user     = " + JSON.stringify(user));

    res.json(user);
  });

  // -------------------------------------
};

// -----------------------------------------------------------------------------

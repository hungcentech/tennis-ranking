// -----------------------------------------------------------------------------

import { Strategy as FacebookStrategy } from "passport-facebook";

import logger from "../../logger";
import config from "../../config";

// -----------------------------------------------------------------------------

export default async (db, app, passport) => {
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
        callbackURL: config.auth.facebook.appUrl + config.auth.facebook.login.cbUrl,
        profileFields: [
          "id",
          "displayName",
          "first_name",
          "last_name",
          "middle_name",
          "name_format",
          "short_name",
          "link",
          "picture.type(large)",
          "birthday",
          "gender",
          "email"
        ]
      },
      (accessToken, refreshToken, profile, cb) => {
        try {
          logger.debug("FacebookStrategy(): profile = " + JSON.stringify(profile));
          let user = {
            ...profile._json,
            accessToken: accessToken,
            expireDate: new Date(new Date().getTime() + 30 * 60 * 1000)
          };

          return cb(null, user);
        } catch (err) {
          logger.debug("FacebookStrategy(): err = " + JSON.stringify(err));
          return cb(err);
        }
      }
    )
  );

  // -------------------------------------

  app.get(
    config.auth.facebook.login.url,
    passport.authenticate("facebook", {
      scope: [
        // "user_friends"
      ]
    })
  );

  // -------------------------------------

  app.get(
    config.auth.facebook.login.cbUrl,
    passport.authenticate("facebook", {
      successRedirect: config.auth.facebook.appDomain + config.auth.facebook.appUrl + config.auth.facebook.login.cbUrlSuccess,
      failureRedirect: config.auth.facebook.appDomain + config.auth.facebook.appUrl + config.auth.facebook.login.cbUrlFailure
    })
  );

  // -------------------------------------

  app.get(config.auth.facebook.login.cbUrlSuccess, (req, res) => {
    logger.debug(config.auth.facebook.login.cbUrlSuccess + ": login success. User = " + JSON.stringify(req.user));

    res.json(req.user);
  });

  // -------------------------------------

  app.get(config.auth.facebook.login.cbUrlFailure, (req, res) => {
    logger.debug(config.auth.facebook.login.cbUrlFailure + ": login failure. params = " + JSON.stringify(req.params));
    logger.debug(config.auth.facebook.login.cbUrlFailure + ": login failure. err = " + JSON.stringify(req.err));

    res.json(req.params);
  });

  // -------------------------------------
};

// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------

import { Strategy as FacebookStrategy } from "passport-facebook";

import logger from "../../logger";
import conf from "../../conf";

// -----------------------------------------------------------------------------

export default async (db, app, passport) => {
  // -------------------------------------
  // Implement 2 passport callbacks
  // -------------------------------------
  passport.serializeUser(function(user, cb) {
    cb(null, user);
  });
  passport.deserializeUser(function(user, cb) {
    cb(null, user);
  });

  // -------------------------------------
  // Install passport middleware
  // -------------------------------------
  await passport.use(
    new FacebookStrategy(
      {
        clientID: conf.auth.facebook.clientId,
        clientSecret: conf.auth.facebook.clientSecret,
        callbackURL: conf.appUrl + conf.auth.facebook.login.cbUrl,
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
          // DEBUG
          logger.debug("FacebookStrategy(): profile = " + JSON.stringify(profile));

          let user = {
            ...profile._json,
            facebook: profile.displayName,
            accessToken: accessToken
            // expireDate: new Date(new Date().getTime() + 30 * 60 * 1000)
          };

          // Search existing user/add new user
          // => update id
          // ...

          return cb(null, user);
        } catch (err) {
          logger.debug("FacebookStrategy(): err = " + JSON.stringify(err));
          return cb(err);
        }
      }
    )
  );

  // -------------------------------------
  // Install express GET handler:
  //   receive user login request from app
  //   => redirect user to FB login dialog
  // -------------------------------------
  app.get(
    conf.auth.facebook.login.url,
    passport.authenticate("facebook", {
      scope: [
        // "user_friends"
      ]
    })
  );

  // -------------------------------------
  // Install express GET handler:
  //   handle FB callback (result of user interaction)
  //   => pass the req to passport middleware
  // -------------------------------------
  app.get(
    conf.auth.facebook.login.cbUrl,
    passport.authenticate("facebook", {
      successRedirect: conf.appDomain + conf.appUrl + conf.auth.facebook.login.cbUrlSuccess,
      failureRedirect: conf.appDomain + conf.appUrl + conf.auth.facebook.login.cbUrlFailure
    })
  );

  // -------------------------------------
  // Install express GET handler:
  //   hadle passport callback after login success
  // -------------------------------------
  app.get(conf.auth.facebook.login.cbUrlSuccess, (req, res) => {
    // DEBUG
    logger.debug(conf.auth.facebook.login.cbUrlSuccess + ": login success. User = " + JSON.stringify(req.user));

    let uri2App = encodeURI(
      conf.appDomain +
        conf.appUrl +
        (req.user
          ? "?id=" +
            (req.user.id ? req.user.id : "") +
            "&token=" +
            (req.user.accessToken ? req.user.accessToken : "") +
            "&avatar=" +
            encodeURIComponent(
              req.user.picture && req.user.picture.data && req.user.picture.data.url ? req.user.picture.data.url : ""
            ) +
            "&facebook=" +
            (req.user.facebook ? req.user.facebook : "") +
            "&name=" +
            (req.user.name ? req.user.name : "")
          : "")
    );

    logger.debug(conf.auth.facebook.login.cbUrlSuccess + ": uri2App = " + uri2App);

    res.redirect(uri2App);
  });

  // -------------------------------------
  // Install express GET handler:
  //   hadle passport callback after login failed
  // -------------------------------------
  app.get(conf.auth.facebook.login.cbUrlFailure, (req, res) => {
    logger.debug(conf.auth.facebook.login.cbUrlFailure + ": login failed, req.params = " + JSON.stringify(req.params));
    logger.debug(conf.auth.facebook.login.cbUrlFailure + ": req.err = " + JSON.stringify(req.err));
    // logger.debug(conf.auth.facebook.login.cbUrlFailure + ": conf = " + JSON.stringify(conf));

    let uri2App = encodeURI(conf.appDomain + conf.appUrl);
    res.redirect(uri2App);
  });

  // -------------------------------------
};

// -----------------------------------------------------------------------------

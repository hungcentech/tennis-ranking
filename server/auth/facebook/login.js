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
        callbackURL: conf.appDomain + conf.appUrl + conf.auth.facebook.login.cbUrl,
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

          //   "id": "10157640491092752",
          //   "displayName": "Le Manh Hung",
          //   "name": {
          //     "familyName": "Hung",
          //     "givenName": "Le",
          //     "middleName": "Manh"
          //   },
          //   "gender": "male",
          //   "emails": [
          //     {
          //       "value": "lemanhhung@yahoo.com"
          //     }
          //   ],
          //   "photos": [
          //     {
          //       "value": "https://platform-lookaside.fbsbx.com/platform/profilepic/?asid=10157640491092752&height=200&width=200&ext=1581134625&hash=AeS5TuiD_COx1Ctu"
          //     }
          //   ],
          //   "provider": "facebook",
          //   "_raw": "{\"id\":\"10157640491092752\",\"name\":\"Le Manh Hung\",\"first_name\":\"Le\",\"last_name\":\"Hung\",\"middle_name\":\"Manh\",\"name_format\":\"{first} {last}\",\"short_name\":\"Le\",\"picture\":{\"data\":{\"height\":200,\"is_silhouette\":false,\"url\":\"https:\\/\\/platform-lookaside.fbsbx.com\\/platform\\/profilepic\\/?asid=10157640491092752&height=200&width=200&ext=1581134625&hash=AeS5TuiD_COx1Ctu\",\"width\":200}},\"birthday\":\"06\\/15\\/1976\",\"gender\":\"male\",\"email\":\"lemanhhung\\u0040yahoo.com\"}",
          //   "_json": {
          //     "id": "10157640491092752",
          //     "name": "Le Manh Hung",
          //     "first_name": "Le",
          //     "last_name": "Hung",
          //     "middle_name": "Manh",
          //     "name_format": "{first} {last}",
          //     "short_name": "Le",
          //     "picture": {
          //       "data": {
          //         "height": 200,
          //         "is_silhouette": false,
          //         "url": "https://platform-lookaside.fbsbx.com/platform/profilepic/?asid=10157640491092752&height=200&width=200&ext=1581134625&hash=AeS5TuiD_COx1Ctu",
          //         "width": 200
          //       }
          //     },
          //     "birthday": "06/15/1976",
          //     "gender": "male",
          //     "email": "lemanhhung@yahoo.com"
          //   }

          let user = {
            id: profile.id, // from DB or create new
            name: profile.displayName, // from DB or FB name
            facebook: {
              id: profile.id,
              name: profile.displayName
            },
            avatar: profile.photos && profile.photos.length > 0 ? profile.photos[0].value : undefined,
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
            encodeURIComponent(req.user.id ? req.user.id : "") +
            "&name=" +
            encodeURIComponent(req.user.name ? req.user.name : "") +
            "&facebook=" +
            encodeURIComponent(req.user.facebook.name ? req.user.facebook.name : "") +
            "&avatar=" +
            encodeURIComponent(req.user.avatar ? req.user.avatar : "") +
            "&token=" +
            encodeURIComponent(req.user.accessToken ? req.user.accessToken : "")
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

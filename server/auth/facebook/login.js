// -----------------------------------------------------------------------------

import { Strategy as FacebookStrategy } from "passport-facebook";

import logger from "../../logger";
import conf from "../../conf";
import { ObjectId } from "mongodb";

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
        callbackURL: `${conf.appDomain}${conf.appUrl}${conf.auth.facebook.login.cbUrl}`,
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
          logger.debug(`passport.FacebookStrategy(): profile = ${JSON.stringify(profile)}`);

          // Update by fbId, then search the user (by fbId)
          //   if found => return user info
          //   else (not found) => create new user, then return user info
          db.collection("players")
            .updateMany(
              { fbId: profile.id },
              {
                $set: {
                  token: accessToken,
                  tokenDate: new Date()
                }
              }
            )
            .then(() => {
              //
              const returnedObject = player => {
                return {
                  id: player._id,
                  name: player.name,
                  facebook: player.facebook,
                  avatar: player.avatar,
                  token: player.token
                };
              };

              db.collection("players")
                .find({ fbId: profile.id })
                .limit(1)
                .next()
                .then(player => {
                  if (player) {
                    // DEBUG:
                    logger.debug(`passport.FacebookStrategy(): player found => update() success: ${JSON.stringify(player)}`);

                    return cb(null, returnedObject(player));
                  } else {
                    // DEBUG:
                    logger.debug(`passport.FacebookStrategy(): player not found => creating new user...`);

                    // Insert new player
                    db.collection("players")
                      .insertOne({
                        name: profile.displayName,
                        fbId: profile.id,
                        facebook: profile.displayName,
                        gender: profile.gender,
                        email: profile.emails && profile.emails.length > 0 ? profile.emails[0].value : undefined,
                        avatar: profile.photos && profile.photos.length > 0 ? profile.photos[0].value : undefined,
                        birthday: profile._json ? profile._json.birthday : undefined,
                        token: accessToken,
                        tokenDate: new Date()
                      })
                      .then(result =>
                        db
                          .collection("players")
                          .find({ _id: result.insertedId })
                          .limit(1)
                          .next()
                      )
                      .then(player => {
                        if (player) {
                          // DEBUG:
                          logger.debug(`passport.FacebookStrategy(): player creation success: ${JSON.stringify(player)}`);

                          return cb(null, returnedObject(player));
                        } else {
                          // DEBUG:
                          logger.warn(`passport.FacebookStrategy() : player creation failed.`);

                          return cb(null, false);
                        }
                      })
                      .catch(err => {
                        // DEBUG:
                        logger.warn(`passport.FacebookStrategy() : insert() failed: ${err}`);

                        return cb(null, false);
                      });
                  }
                })
                .catch(err => {
                  logger.warn(`passport.FacebookStrategy(): find() failed: ${err}`);
                  return cb(null, false, err);
                });
            })
            .catch(err => {
              logger.warn(`passport.FacebookStrategy(): update() failed: ${err}`);
              return cb(null, false, err);
            });

          // ----------------
        } catch (err) {
          logger.warn(`passport.FacebookStrategy(): ${err}`);
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
  //   receive user logout request from app
  //   => delete user's token in db
  // -------------------------------------
  app.get(conf.auth.facebook.logout.url, (req, res) => {
    // DEBUG:
    logger.debug(`handleLogout(): req headers = ${JSON.stringify(req.headers)}`);
    logger.debug(`handleLogout(): req query (rest-api)  = ${JSON.stringify(req.query)}`);

    if (!req.query.id || !req.headers["authorization"]) {
      let err = new Error("Invalid query");
      logger.warn(`handleLogout(): ${err}. id=${req.query.id}, auth-header=${req.headers["authorization"]}`);
      res.status(400).json(err);
    } else {
      // Authorization check => find()
      let playerId = new ObjectId(req.query.id);
      let token = req.headers["authorization"].substr("Bearer ".length);
      db.collection("players")
        .find({ _id: playerId, token: token })
        .limit(1)
        .next()
        .then(player => {
          if (player) {
            logger.debug(`handleLogout(): Logged in user found: ${JSON.stringify(player)}`);

            db.collection("players")
              .updateMany({ _id: playerId }, { $set: { token: undefined } })
              .then(() =>
                db
                  .collection("players")
                  .find({ _id: playerId })
                  .limit(1)
                  .next()
              )
              .then(savedPlayer => {
                if (savedPlayer && !savedPlayer.token) {
                  logger.debug(`handleLogout(): token cleared, logout success`);
                  res.status(200).json({ message: "Logout success." });
                } else {
                  logger.warn(`handleLogout(): token not cleared, logout failed. player = ${JSON.stringify(savedPlayer)}`);
                  res.status(500).json({ message: `Internal Server Err: ${err}` });
                }
              })
              .catch(err => {
                logger.warn("handleLogout(): ", err);
                res.status(500).json({ message: `Internal Server Err: ${err}` });
              });
          } else {
            logger.debug(`handleLogout(): User not found or not logged in. (_id: ${playerId})`);
            res.status(200).json({ message: "Logout success. Not logged in." });
          }
        })
        .catch(err => {
          logger.debug(`handleLogout(): Server error: ${err}`);
          res.status(500).json({ message: `Logout failed. ${err}` });
        });
    }
  });

  // -------------------------------------
  // Install express GET handler:
  //   handle FB callback (result of user interaction)
  //   => pass the req to passport middleware
  // -------------------------------------
  app.get(
    conf.auth.facebook.login.cbUrl,
    passport.authenticate("facebook", {
      successRedirect: `${conf.appDomain}${conf.appUrl}${conf.auth.facebook.login.cbUrlSuccess}`,
      failureRedirect: `${conf.appDomain}${conf.appUrl}${conf.auth.facebook.login.cbUrlFailure}`
    })
  );

  // -------------------------------------
  // Install express GET handler:
  //   hadle passport callback after login success
  // -------------------------------------
  app.get(conf.auth.facebook.login.cbUrlSuccess, (req, res) => {
    // DEBUG
    logger.debug(`${conf.auth.facebook.login.cbUrlSuccess}: login success, user = ${JSON.stringify(req.user)}`);

    let uri2App = encodeURI(
      `${conf.appDomain}${conf.appUrl}?${
        req.user
          ? Object.keys(req.user)
              .map(key => `${key}=${encodeURIComponent(req.user[key])}`)
              .join("&")
          : ""
      }`
    );

    logger.debug(`${conf.auth.facebook.login.cbUrlSuccess}: uri2App = ${uri2App}`);

    res.redirect(uri2App);
  });

  // -------------------------------------
  // Install express GET handler:
  //   hadle passport callback after login failed
  // -------------------------------------
  app.get(conf.auth.facebook.login.cbUrlFailure, (req, res) => {
    logger.debug(`${conf.auth.facebook.login.cbUrlFailure}: login failed, req.query = ${JSON.stringify(req.query)}`);
    logger.debug(`${conf.auth.facebook.login.cbUrlFailure}: login failed, req.err = ${JSON.stringify(req.err)}`);

    let uri2App = encodeURI(`${conf.appDomain}${conf.appUrl}`);
    res.redirect(uri2App);
  });

  // -------------------------------------
};

// -----------------------------------------------------------------------------

// LOGS:
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

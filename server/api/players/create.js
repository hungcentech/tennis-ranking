// -----------------------------------------------------------------------------

import logger from "../../logger";
import conf from "../../conf";
import { authCheck } from "../../auth";
import { validate } from "./Player.js";

// -----------------------------------------------------------------------------
// POST:
// {
// 	"data": {
// 	    "status": "active",
// 	    "name": "Hùng",
// 	    "facebook": "Le Manh Hung",
// 	    "admins": [],
// 	    "notes": "",
// 	    "avatar": "",
// 	    "changes": []
//     },
// 	"user": {
//      "_id":"12341341234134",
//      "facebook": "Le Manh Hung"
//     },
// 	"change":"test"
// }
// -----------------------------------------------------------------------------

export default (db, app) => {
  app.post(conf.api.players.url, (req, res) => {
    // DEBUG:
    logger.debug(`api.players.create(): req auth = ${JSON.stringify(req.headers["authorization"])}`);
    logger.debug(`api.players.create(): req body = ${JSON.stringify(req.body)}`);

    let apiReq = req.body;
    if (!apiReq || !apiReq.user || !apiReq.user.id || !apiReq.data || !req.headers["authorization"]) {
      let error = Error("Invalid request data.");
      logger.debug(`api.players.create(): error = ${error.message}`);
      res.status(422).json(error);
      return;
    } else {
      apiReq.token = req.headers["authorization"].substr("Bearer ".length);
      apiReq.function = "create players";

      authCheck(db, apiReq)
        .then(apiReq => {
          validate(apiReq)
            .then(validated => {
              // update changes: array of {date: Date, user: {id, facebook}, change: {k1: change1, k2: change2...} }
              let change = {
                date: new Date(),
                user: validated.user,
                change: { create: true }
              };

              db.collection("players")
                .insertOne(validated.data)
                .then(result =>
                  db
                    .collection("players")
                    .find({ _id: result.insertedId })
                    .limit(1)
                    .next()
                )
                .then(record => {
                  if (record) {
                    logger.debug(`api.players.create(): Inserted record = ${JSON.stringify(record)}`);
                    res.json({ inserted: record });
                  } else {
                    let error = Error("api.players.create(): No record inserted");
                    logger.warn(error.message);
                    res.status(422).json(error);
                  }
                })
                .catch(err => {
                  let error = Error(`api.players.create(): find() failed: ${err}`);
                  logger.warn(error.message);
                  res.status(422).json(error);
                });
            })
            .catch(err => {
              let error = Error(`api.players.create(): Data validation failed: ${err}`);
              logger.warn(error.message);
              res.status(500).json(error);
            });
        })
        .catch(err => {
          let error = Error(`api.players.create(): Authentication failed: ${err}`);
          logger.warn(error.message);
          res.status(422).json(error);
        });
    }
  });
};

// -----------------------------------------------------------------------------

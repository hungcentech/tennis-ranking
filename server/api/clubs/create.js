// -----------------------------------------------------------------------------

import logger from "../../logger";
import conf from "../../conf";
import { authCheck } from "../../auth";
import { validate } from "./Club.js";

// -----------------------------------------------------------------------------
// POST:
// {
// 	"data": {
// 	    "status": "active",
// 	    "name": "Tennis Angels 3",
// 	    "address": "76 An Duong",
// 	    "admins": [],
// 	    "description": "",
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
  app.post(conf.api.clubs.url, (req, res) => {
    // DEBUG:
    logger.debug(`api.clubs.create(): req headers = ${JSON.stringify(req.headers)}`);
    logger.debug(`api.clubs.create(): req params  = ${JSON.stringify(req.params)}`);
    logger.debug(`api.clubs.create(): req body    = ${JSON.stringify(req.body)}`);

    let apiReq = req.body;
    if (!apiReq || !apiReq.user || !apiReq.data || !req.headers["authorization"]) {
      let error = Error("Invalid request data.");
      logger.debug(`api.clubs.create(): error = ${error.message}`);
      res.status(422).json(error);
      return;
    } else {
      apiReq.token = req.headers["authorization"].substr("Bearer ".length);

      authCheck(db, apiReq)
        .then(apiReq => {
          validate(apiReq)
            .then(validated =>
              db
                .collection("clubs")
                .insertOne(validated.data)
                .then(result =>
                  db
                    .collection("clubs")
                    .find({ _id: result.insertedId })
                    .limit(1)
                    .next()
                )
                .then(record => {
                  if (record) {
                    logger.debug(`api.clubs.create(): Inserted record = ${JSON.stringify(record)}`);
                    res.json({ inserted: record });
                  } else {
                    let error = Error("api.clubs.create(): No record inserted");
                    logger.warn(error.message);
                    res.status(422).json(error);
                  }
                })
                .catch(err => {
                  let error = Error(`api.clubs.create(): find() failed: ${err}`);
                  logger.warn(error.message);
                  res.status(422).json(error);
                })
            )
            .catch(err => {
              let error = Error(`api.clubs.create(): Data validation failed: ${err}`);
              logger.warn(error.message);
              res.status(500).json(error);
            });
        })
        .catch(err => {
          let error = Error(`api.clubs.create(): Authentication failed: ${err}`);
          logger.warn(error.message);
          res.status(422).json(error);
        });
    }
  });
};

// -----------------------------------------------------------------------------

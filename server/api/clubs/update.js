// -----------------------------------------------------------------------------

import logger from "../../logger";
import conf from "../../conf";
import { authCheck } from "../../auth";
import { validate } from "./Club.js";

// -----------------------------------------------------------------------------
// PUT:
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
// 	"change": "name: aaaa => Tennis Angels 3"
// }
// -----------------------------------------------------------------------------

export default (db, app) => {
  app.put(conf.api.clubs.url, (req, res) => {
    // DEBUG:
    logger.debug(`api.clubs.update(): req headers = ${JSON.stringify(req.headers)}`);
    logger.debug(`api.clubs.update(): req params  = ${JSON.stringify(req.params)}`);
    logger.debug(`api.clubs.update(): req body    = ${JSON.stringify(req.body)}`);

    let apiReq = req.body;
    if (!apiReq || !apiReq.user || !apiReq.user.id || !apiReq.data || !req.headers["authorization"]) {
      let error = Error("Invalid request data.");
      logger.debug(`api.clubs.update(): error = ${error.message}`);
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
                    logger.debug(`api.clubs.update(): Inserted record = ${JSON.stringify(record)}`);
                    res.json({ inserted: record });
                  } else {
                    let error = Error("api.clubs.update(): No record inserted");
                    logger.warn(error.message);
                    res.status(422).json(error);
                  }
                })
                .catch(err => {
                  let error = Error(`api.clubs.update(): find() failed: ${err}`);
                  logger.warn(error.message);
                  res.status(422).json(error);
                })
            )
            .catch(err => {
              let error = Error(`api.clubs.update(): Data validation failed: ${err}`);
              logger.warn(error.message);
              res.status(500).json(error);
            });
        })
        .catch(err => {
          let error = Error(`api.clubs.update(): Authentication failed: ${err}`);
          logger.warn(error.message);
          res.status(422).json(error);
        });
    }

    //   db.collection("clubs")
    //     .update({ _id: clubId }, Player.convertPlayer(club))
    //     .then(() =>
    //       db
    //         .collection("clubs")
    //         .find({ _id: clubId })
    //         .limit(1)
    //         .next()
    //     )
    //     .then(savedPlayer => {
    //       res.json(savedPlayer);
    //     })
    //     .catch(error => {
    //       logger.warn("api.club.update(): ", error);
    //       res.status(500).json({ message: `Internal Server Error: ${error}` });
    //     });
  });
};

// -----------------------------------------------------------------------------

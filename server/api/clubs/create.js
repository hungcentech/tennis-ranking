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
// 	    "name": "CLB Tennis Gió Mùa",
// 	    "address": "Cụm 2 sân mái che, đối diện cổng sân bóng BCA Nguyễn Xiển, Hà Nội",
// 	    "admins": [],
// 	    "notes": "CN 9:00-14:00",
// 	    "avatar": "",
// 	    "changes": []
//     }
// }
// -----------------------------------------------------------------------------

export default (db, app) => {
  app.post(conf.api.clubs.url, (req, res) => {
    // DEBUG:
    logger.debug(`api.clubs.create(): req auth = ${JSON.stringify(req.headers["authorization"])}`);
    logger.debug(`api.clubs.create(): req body = ${JSON.stringify(req.body)}`);

    let apiReq = req.body;
    if (!apiReq || !apiReq.data || !req.headers["authorization"]) {
      let error = Error("Invalid request data.");
      logger.debug(`api.clubs.create(): error = ${error.message}`);
      res.status(422).json(error);
      return;
    } else {
      apiReq.token = req.headers["authorization"].substr("Bearer ".length);
      apiReq.function = "create clubs";

      authCheck(db, apiReq)
        .then(apiReq => {
          validate(apiReq)
            .then(validated => {
              validated.data.created = new Date();

              db.collection("clubs")
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
                });
            })
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

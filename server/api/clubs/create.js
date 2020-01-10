// -----------------------------------------------------------------------------

import logger from "../../logger";
import conf from "../../conf";
import { authorizationCheck } from "../../auth";
import Club from "./Club.js";

// -----------------------------------------------------------------------------

export default (db, app) => {
  app.post(conf.api.clubs.url, (req, res) => {
    // DEBUG:
    logger.debug(`api.clubs.create(): req auth = ${JSON.stringify(req.headers["authorization"])}`);
    logger.debug(`api.clubs.create(): req body = ${JSON.stringify(req.body)}`);

    // Fields:
    //   Required: reqData.record, reqData.user
    //   Optional: reqData.comment
    let err;
    let reqData = req.body;

    if (!reqData || !reqData.user || !reqData.user._id || !reqData.record) {
      err = "Request body needs more fields";
    } else if (!req.headers["authorization"]) {
      err = "Access token not found";
    }
    if (err) {
      logger.debug(`api.clubs.create(): error = ${err}`);
      res.status(422).json({ error: `Invalid request: ${err}` });
      return;
    }

    reqData.token = req.headers["authorization"].substr("Bearer ".length);

    authorizationCheck(db, reqData)
      .then(reqData => {
        Club.validate(reqData);
      })
      .then(validated => {
        db.collection("clubs").insertOne(validated.record);
      })
      .then(result =>
        db
          .collection("clubs")
          .find({ _id: result.insertedId })
          .limit(1)
          .next()
      )
      .then(record => {
        logger.debug(`api.clubs.create(): Inserted record =`, record);
        res.json({ inserted: record });
      })
      .catch(err => {
        logger.warn(`api.clubs.create(): error =`, err);
        res.status(500).json({ error: `Internal Server Error: ${err}` });
      });
  });
};

// -----------------------------------------------------------------------------

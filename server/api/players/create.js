// -----------------------------------------------------------------------------

import logger from "../../logger";
import conf from "../../conf";
import { authCheck } from "../../auth";
import { validate } from "./Player.js";

// -----------------------------------------------------------------------------

export default (db, app) => {
  app.post(conf.api.players.url, (req, res) => {
    // DEBUG:
    logger.debug(`api.players.create(): req auth = ${JSON.stringify(req.headers["authorization"])}`);
    logger.debug(`api.players.create(): req body = ${JSON.stringify(req.body)}`);

    let apiReq = req.body;
    if (!apiReq || !apiReq.uid || !apiReq.data || !req.headers["authorization"]) {
      let err = "Invalid request data.";
      res.status(422).json({ error: `${err}` });
      return;
    } else {
      apiReq.token = req.headers["authorization"].substr("Bearer ".length);

      authCheck(db, apiReq)
        .then(apiReq => {
          validate(apiReq)
            .then(validated =>
              db
                .collection("players")
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
                    logger.warn(`api.players.create() : err = ${err}`);
                    res.status(422).json({ error: `${err}` });
                  }
                })
                .catch(err => {
                  logger.warn(`api.players.create(): err = ${err}`);
                  res.status(422).json({ error: `${err}` });
                })
            )
            .catch(err => {
              logger.warn(`api.players.create(): err = ${err}`);
              res.status(500).json({ error: `${err}` });
            });
        })
        .catch(err => {
          logger.warn(`api.players.create(): err = ${err}`);
          res.status(400).json({ error: `${err}` });
        });
    }
  });
};

// -----------------------------------------------------------------------------

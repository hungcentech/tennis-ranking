// -----------------------------------------------------------------------------

import logger from "../../logger";
import { authCheck } from "../../auth";
import conf from "../../conf";

// -----------------------------------------------------------------------------

export default (db, app) => {
  //
  // ------------- read all -------------

  app.get(conf.api.clubs.url, (req, res) => {
    // DEBUG:
    logger.debug(`api.clubs.read(): req auth  = ${JSON.stringify(req.headers["authorization"])}`);
    logger.debug(`api.clubs.read(): req query = ${JSON.stringify(req.query)}`);

    // Authorization check => find()
    let apiReq = {
      uid: req.query.uid,
      data: {
        ...req.query,
        uid: undefined
      }
    };

    if (!apiReq || !apiReq.uid || !apiReq.data || !req.headers["authorization"]) {
      let err = Error("Invalid request params.");
      logger.debug(`api.clubs.read(): error = ${err.message}`);
      res.status(400).json(err);
      return;
    } else {
      apiReq.token = req.headers["authorization"].substr("Bearer ".length);

      authCheck(db, apiReq)
        .then(apiReq => {
          let filter = apiReq.data;
          if (filter.search) {
            filter = {
              $or: [
                { name: { $regex: `.*${filter.search}.*`, $options: "i" } },
                { address: { $regex: `.*${filter.search}.*`, $options: "i" } }
              ]
            };
          }
          logger.debug(`api.clubs.read(): authorization success. filter = ${JSON.stringify(filter)}`);

          db.collection("clubs")
            .find(filter) // .collation({ locale: "vi", strength: 3 })
            .limit(0)
            .toArray()
            .then(clubs => {
              const meta = { total: clubs.length };
              const resObj = { meta: meta, records: clubs };
              logger.debug(`api.clubs.read(): result = ${JSON.stringify(resObj)}`);
              res.json(resObj);
            });
        })
        .catch(err => {
          logger.warn(`api.clubs.read(): err = ${err.message}`);
          res.status(400).json(err);
        });
    }
  });

  // ------------- read one -------------

  app.get("/api/clubs/:id", (req, res) => {
    logger.debug(`api.clubs.readOne(): id = ${req.params.id}`);

    let playerId;
    try {
      playerId = new ObjectId(req.params.id);
    } catch (err) {
      logger.debug(`api.clubs.readOne(): Invalid player ID format. ${err}`);
      res.status(400).json({ message: `Invalid player ID format. ${err}` });
      return;
    }
    db.collection("clubs")
      .find({ _id: playerId })
      .limit(1)
      .next()
      .then(player => {
        if (!player) {
          logger.debug(`api.clubs.readOne(): no player found.`);
          res.status(404).json({ message: `No player found with id: ${playerId}` });
        } else {
          logger.debug(`api.clubs.readOne(): result = ${JSON.stringify(player)}`);
          res.json(player);
        }
      })
      .catch(err => {
        logger.warn(`api.clubs.readOne(): err = ${err}`);
        res.status(400).json({ error: `${err}` });
      });
  });

  // ------------------------------------
};

// -----------------------------------------------------------------------------

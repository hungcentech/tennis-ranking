// -----------------------------------------------------------------------------

import logger from "../../logger";
import { authCheck } from "../../auth";
import conf from "../../conf";

// -----------------------------------------------------------------------------

export default (db, app) => {
  //
  // ------------- read all -------------

  app.get(conf.api.players.url, (req, res) => {
    // DEBUG:
    logger.debug(`api.players.read(): req auth  = ${JSON.stringify(req.headers["authorization"])}`);
    logger.debug(`api.players.read(): req query = ${JSON.stringify(req.query)}`);

    // Authorization check => find()
    let apiReq = {
      uid: req.query.uid,
      data: {
        ...req.query,
        uid: undefined
      }
    };

    if (!apiReq || !apiReq.uid || !apiReq.data || !req.headers["authorization"]) {
      let err = "Invalid request params.";
      logger.debug(`api.players.read(): error = ${JSON.stringify(err)}`);
      res.status(400).json({ error: `${err}` });
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
                { facebook: { $regex: `.*${filter.search}.*`, $options: "i" } },
                { email: { $regex: `.*${filter.search}.*`, $options: "i" } }
              ]
            };
          }
          logger.debug(`api.players.read(): authorization success. filter = ${JSON.stringify(filter)}`);

          db.collection("players")
            .find(filter) // .collation({ locale: "vi", strength: 3 })
            .limit(0)
            .toArray()
            .then(players => {
              const meta = { total: players.length };
              const resObj = { meta: meta, records: players };
              logger.debug(`api.players.read(): result = ${JSON.stringify(resObj)}`);
              res.json(resObj);
            });
        })
        .catch(err => {
          logger.warn(`api.players.read(): err = ${JSON.stringify(err)}`);
          res.status(400).json({ error: `${err}` });
        });
    }
  });

  // ------------- read one -------------

  // app.get("/api/players/:id", (req, res) => {
  //   logger.debug(`api.players.readOne(): id = ${req.params.id}`);

  //   let playerId;
  //   try {
  //     playerId = new ObjectId(req.params.id);
  //   } catch (err) {
  //     logger.debug(`api.players.readOne(): Invalid player ID format. ${err}`);
  //     res.status(400).json({ message: `Invalid player ID format. ${err}` });
  //     return;
  //   }
  //   db.collection("players")
  //     .find({ _id: playerId })
  //     .limit(1)
  //     .next()
  //     .then(player => {
  //       if (!player) {
  //         logger.debug(`api.players.readOne(): no player found.`);
  //         res.status(404).json({ message: `No player found with id: ${playerId}` });
  //       } else {
  //         logger.debug(`api.players.readOne(): result = ${JSON.stringify(player)}`);
  //         res.json(player);
  //       }
  //     })
  //     .catch(err => {
  //       logger.warn(`api.players.readOne(): err = ${err}`);
  //       res.status(400).json({ error: `${err}` });
  //     });
  // });

  // ------------------------------------
};

// -----------------------------------------------------------------------------

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
      data: {
        ...req.query
      }
    };

    if (!req.headers["authorization"]) {
      let error = Error("Invalid request params.");
      logger.debug(`api.players.read(): error = ${error.message}`);
      res.status(400).json(error);
      return;
    } else {
      apiReq.token = req.headers["authorization"].substr("Bearer ".length);
      apiReq.function = "read players";
      logger.debug(`api.players.read(): token = ${JSON.stringify(apiReq.token)}`);

      authCheck(db, apiReq)
        .then(apiReq => {
          let filter = apiReq.data;
          if (filter.search) {
            filter = {
              $or: [
                { name: { $regex: `.*${filter.search}.*`, $options: "i" } },
                { facebook: { $regex: `.*${filter.search}.*`, $options: "i" } }
              ]
            };
          }
          logger.debug(`api.players.read(): Authorization success. filter = ${JSON.stringify(filter)}`);

          db.collection("players")
            .find(filter) // .collation({ locale: "vi", strength: 3 })
            // .limit(3)
            .toArray()
            .then(players => {
              // _id => id
              players.map(player => {
                player.id = player._id;
                player._id = undefined;
                player.changes = undefined;
              });
              // DEBUG:
              logger.debug(`api.players.read(): players = ${JSON.stringify(players)}`);

              db.collection("players")
                .countDocuments(filter)
                .then(playersCount => {
                  logger.debug(`api.players.read(): players count = ${playersCount}`);

                  const meta = {
                    length: players.length,
                    count: playersCount
                  };
                  const resObj = { meta: meta, records: players };
                  logger.debug(`api.players.read(): result = ${JSON.stringify(resObj)}`);
                  res.json(resObj);
                })
                .catch(err => {
                  logger.debug(`api.players.read(): countDocuments() err = ${err}`);
                });
            })
            .catch(err => {
              logger.debug(`api.players.read(): find() error = ${err}`);
            });
        })
        .catch(err => {
          logger.warn(`api.players.read(): ${err.message}`);
          res.status(400).json(err);
        });
    }
  });

  // ------------------------------------
};

// -----------------------------------------------------------------------------

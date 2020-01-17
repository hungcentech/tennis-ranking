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
      data: {
        ...req.query
      }
    };

    if (!req.headers["authorization"]) {
      let error = Error("Invalid request params.");
      logger.debug(`api.clubs.read(): error = ${error.message}`);
      res.status(400).json(error);
      return;
    } else {
      apiReq.token = req.headers["authorization"].substr("Bearer ".length);
      apiReq.function = "read clubs";
      logger.debug(`api.clubs.read(): token = ${JSON.stringify(apiReq.token)}`);

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
          logger.debug(`api.clubs.read(): Authorization success. filter = ${JSON.stringify(filter)}`);

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
          logger.warn(`api.clubs.read(): ${err.message}`);
          res.status(400).json(err);
        });
    }
  });

  // ------------------------------------
};

// -----------------------------------------------------------------------------

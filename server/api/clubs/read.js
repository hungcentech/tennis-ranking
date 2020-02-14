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
      logger.debug(`api.clubs.read(): apiReq = ${JSON.stringify(apiReq)}`);

      authCheck(db, apiReq)
        .then(apiReq => {
          let filter = apiReq.data;
          if (filter.search) {
            filter = {
              $or: [
                { name: { $regex: `.*${filter.search}.*`, $options: "i" } },
                { address: { $regex: `.*${filter.search}.*`, $options: "i" } },
                { notes: { $regex: `.*${filter.search}.*`, $options: "i" } }
              ]
            };
          }
          logger.debug(`api.clubs.read(): Authorization success. filter = ${JSON.stringify(filter)}`);

          db.collection("clubs")
            .find(filter) // .collation({ locale: "vi", strength: 3 })
            // .limit(3)
            .toArray()
            .then(clubs => {
              // _id => id
              clubs.map(club => {
                club.id = club._id;
                club._id = undefined;
                club.changes = undefined;
              });
              // DEBUG:
              logger.debug(`api.clubs.read(): clubs = ${JSON.stringify(clubs)}`);

              db.collection("clubs")
                .countDocuments(filter)
                .then(clubsCount => {
                  logger.debug(`api.clubs.read(): clubs count = ${clubsCount}`);

                  const meta = {
                    length: clubs.length,
                    count: clubsCount
                  };
                  const resObj = { meta: meta, records: clubs };
                  logger.debug(`api.clubs.read(): result = ${JSON.stringify(resObj)}`);
                  res.json(resObj);
                })
                .catch(err => {
                  logger.debug(`api.clubs.read(): countDocuments() err = ${err}`);
                });
            })
            .catch(err => {
              logger.debug(`api.clubs.read(): find() error = ${err}`);
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

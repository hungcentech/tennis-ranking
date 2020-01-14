// -----------------------------------------------------------------------------

import logger from "../../logger";
import config from "../../conf";

// -----------------------------------------------------------------------------

export default (db, app) => {
  // --- get all ---
  app.get("/api/matches", (req, res) => {
    logger.debug(`GET /api/matches : req headers = ${JSON.stringify(req.headers)}`);
    logger.debug(`GET /api/matches : req query = ${JSON.stringify(req.query)}`);
    const filter = req.query;
    // if (req.query.effort_lte || req.query.effort_gte) filter.effort = {};
    // if (req.query.effort_gte) filter.effort.$gte = parseInt(req.query.effort_gte, 10);
    // if (req.query.effort_lte) filter.effort.$lte = parseInt(req.query.effort_lte, 10);

    db.collection("matches")
      .find(filter)
      .toArray()
      .then(matches => {
        const metaData = { total_count: matches.length };
        const resObj = { meta: metaData, records: matches };
        logger.debug(`GET /api/matches : result = ${JSON.stringify(resObj)}`);
        res.json(resObj);
      })
      .catch(err => {
        logger.warn(`GET /api/matches : err = ${err}`);
        res.status(500).json({ message: `Internal Server Error. ${err}` });
      });
  });

  // --- get one ---
  app.get("/api/matches/:id", (req, res) => {
    logger.debug(`GET /api/matches/:id : id = ${req.params.id}`);

    let matchId;
    try {
      matchId = new ObjectId(req.params.id);
    } catch (err) {
      logger.debug(`GET /api/matches/:id : Invalid match ID format. ${err}`);
      res.status(400).json({ message: `Invalid match ID format. ${err}` });
      return;
    }
    db.collection("matches")
      .find({ _id: matchId })
      .limit(1)
      .next()
      .then(match => {
        if (!match) {
          logger.debug("GET /api/matches/:id : No such match.");
          res.status(404).json({ message: `No such match: ${matchId}` });
        } else {
          logger.debug(`GET /api/matches/:id : result = ${JSON.stringify(match)}`);
          res.json(match);
        }
      })
      .catch(err => {
        logger.warn(`GET /api/matches : err = ${err}`);
        res.status(500).json({ message: `Internal Server Error. ${err}` });
      });
  });
};

// -----------------------------------------------------------------------------

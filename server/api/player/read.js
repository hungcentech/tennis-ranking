// -----------------------------------------------------------------------------

import logger from "../../logger";
import config from "../../config";

// -----------------------------------------------------------------------------

export default (db, app) => {
  // --- get all ---
  app.get("/api/players", (req, res) => {
    logger.debug(`GET /api/players : query = ${JSON.stringify(req.query)}`);
    const filter = req.query;
    // if (req.query.effort_lte || req.query.effort_gte) filter.effort = {};
    // if (req.query.effort_gte) filter.effort.$gte = parseInt(req.query.effort_gte, 10);
    // if (req.query.effort_lte) filter.effort.$lte = parseInt(req.query.effort_lte, 10);

    db.collection("players")
      .find(filter)
      .toArray()
      .then(players => {
        const metaData = { total_count: players.length };
        const resObj = { meta: metaData, records: players };
        logger.debug(`GET /api/players : result = ${JSON.stringify(resObj)}`);
        res.json(resObj);
      })
      .catch(err => {
        logger.warn(`GET /api/players : err = ${err}`);
        res.status(500).json({ message: `Internal Server Error. ${err}` });
      });
  });

  // --- get one ---
  app.get("/api/players/:id", (req, res) => {
    logger.debug(`GET /api/players/:id : id = ${req.params.id}`);

    let playerId;
    try {
      playerId = new ObjectId(req.params.id);
    } catch (err) {
      logger.debug(`GET /api/players/:id : Invalid player ID format. ${err}`);
      res.status(422).json({ message: `Invalid player ID format. ${err}` });
      return;
    }
    db.collection("players")
      .find({ _id: playerId })
      .limit(1)
      .next()
      .then(player => {
        if (!player) {
          logger.debug("GET /api/players/:id : No such player.");
          res.status(404).json({ message: `No such player: ${playerId}` });
        } else {
          logger.debug(`GET /api/players/:id : result = ${JSON.stringify(player)}`);
          res.json(player);
        }
      })
      .catch(err => {
        logger.warn(`GET /api/players : err = ${err}`);
        res.status(500).json({ message: `Internal Server Error. ${err}` });
      });
  });
};

// -----------------------------------------------------------------------------

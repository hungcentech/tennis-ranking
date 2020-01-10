// -----------------------------------------------------------------------------

import logger from "../../logger";
import conf from "../../conf";

// -----------------------------------------------------------------------------

export default (db, app) => {
  //
  // ------------- read all -------------

  app.get(conf.api.clubs.url, (req, res) => {
    // DEBUG:
    logger.debug(`api.clubs.read(): req auth  = ${JSON.stringify(req.headers["authorization"])}`);
    logger.debug(`api.clubs.read(): req query = ${JSON.stringify(req.query)}`);

    // Authorization check
    const user = { id: req.query.user, token: req.headers["authorization"].substr("Bearer ".length) };

    const filter = {
      ...req.query,
      user: undefined
    };

    db.collection("clubs")
      .find(filter)
      .limit(3)
      .toArray()
      .then(clubs => {
        const meta = { total: clubs.length };
        const resObj = { meta: meta, records: clubs };
        logger.debug(`api.clubs.read() : result = ${JSON.stringify(resObj)}`);
        res.json(resObj);
      })
      .catch(err => {
        logger.warn(`api.clubs.read() : err = ${err}`);
        res.status(500).json({ message: `Internal Server Error. ${err}` });
      });
  });

  // ------------- read one -------------

  app.get("/api/clubs/:id", (req, res) => {
    logger.debug(`api.clubs.readOne(): id = ${req.params.id}`);

    let playerId;
    try {
      playerId = new ObjectId(req.params.id);
    } catch (err) {
      logger.debug(`api.clubs.readOne(): Invalid player ID format. ${err}`);
      res.status(422).json({ message: `Invalid player ID format. ${err}` });
      return;
    }
    db.collection("clubs")
      .find({ _id: playerId })
      .limit(1)
      .next()
      .then(player => {
        if (!player) {
          logger.debug(`api.clubs.readOne(): No such player.`);
          res.status(404).json({ message: `No such player: ${playerId}` });
        } else {
          logger.debug(`api.clubs.readOne(): result = ${JSON.stringify(player)}`);
          res.json(player);
        }
      })
      .catch(err => {
        logger.warn(`api.clubs.readOne(): err = ${err}`);
        res.status(500).json({ message: `Internal Server Error. ${err}` });
      });
  });

  // ------------------------------------
};

// -----------------------------------------------------------------------------

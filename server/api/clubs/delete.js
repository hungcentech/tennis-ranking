// -----------------------------------------------------------------------------

import logger from "../../logger";
import config from "../../config";

import { ObjectId } from "mongodb";

// -----------------------------------------------------------------------------

export default (db, app) => {
  app.delete("/api/clubs/:id", (req, res) => {
    logger.debug(`api.clubs.delete() : id = ${req.params.id}`);
    let playerId;
    try {
      playerId = new ObjectId(req.params.id);
    } catch (err) {
      logger.debug(`api.clubs.delete() : Invalid player ID format. ${err}`);
      res.status(422).json({ message: `Invalid player ID format: ${err}` });
      return;
    }
    db.collection("clubs")
      .deleteOne({ _id: playerId })
      .then(deleteResult => {
        if (deleteResult.result.n === 1) {
          logger.debug("api.clubs.delete() : Object deleted.");
          res.json({ status: "OK" });
        } else {
          logger.debug("api.clubs.delete() : Object not found.");
          res.json({ status: "Warning: Object not found." });
        }
      })
      .catch(err => {
        logger.debug(`api.clubs.delete() : err = ${err}`);
        res.status(500).json({ message: `Internal Server Error. ${err}` });
      });
  });
};

// -----------------------------------------------------------------------------

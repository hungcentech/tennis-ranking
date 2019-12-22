// -----------------------------------------------------------------------------

import logger from "../../logger";
import config from "../../config";

import { ObjectId } from "mongodb";

// -----------------------------------------------------------------------------

export default (db, app) => {
  app.delete("/api/matches/:id", (req, res) => {
    logger.debug(`DELETE /api/matches/:id : id = ${req.params.id}`);
    let matchId;
    try {
      matchId = new ObjectId(req.params.id);
    } catch (err) {
      logger.debug(`DELETE /api/matches/:id : Invalid match ID format. ${err}`);
      res.status(422).json({ message: `Invalid match ID format: ${err}` });
      return;
    }
    db.collection("matches")
      .deleteOne({ _id: matchId })
      .then(deleteResult => {
        if (deleteResult.result.n === 1) {
          logger.debug("DELETE /api/matches/:id : Object deleted.");
          res.json({ status: "OK" });
        } else {
          logger.debug("DELETE /api/matches/:id : Object not found.");
          res.json({ status: "Warning: Object not found." });
        }
      })
      .catch(err => {
        logger.debug(`DELETE /api/matches/:id : err = ${err}`);
        res.status(500).json({ message: `Internal Server Error. ${err}` });
      });
  });
};

// -----------------------------------------------------------------------------

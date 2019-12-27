// -----------------------------------------------------------------------------

import logger from "../../logger";
import config from "../../config";

// -----------------------------------------------------------------------------

export default (db, app) => {
  app.put("/api/players/:id", (req, res) => {
    let playerId;
    try {
      playerId = new ObjectId(req.params.id);
    } catch (error) {
      res.status(422).json({ message: `Invalid player ID format: ${error}` });
      return;
    }

    const player = req.body;
    logger.debug("put('api/players/:id'): player =", player);
    delete player._id;

    const err = Player.validatePlayer(player);
    if (err) {
      res.status(422).json({ message: `Invalid request: ${err}` });
      return;
    }

    db.collection("players")
      .update({ _id: playerId }, Player.convertPlayer(player))
      .then(() =>
        db
          .collection("players")
          .find({ _id: playerId })
          .limit(1)
          .next()
      )
      .then(savedPlayer => {
        res.json(savedPlayer);
      })
      .catch(error => {
        logger.warn("api/player(): ", error);
        res.status(500).json({ message: `Internal Server Error: ${error}` });
      });
  });
};

// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------

import logger from "../../logger";
import config from "../../conf";

// -----------------------------------------------------------------------------

export default (db, app) => {
  app.put("/api/players/:id", (req, res) => {
    let playerId;
    try {
      playerId = new ObjectId(req.params.id);
    } catch (err) {
      res.status(422).json({ message: `Invalid player id format: ${err}` });
      return;
    }

    const player = req.body;
    logger.debug("api.players.update(): player =", player);
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
      .catch(err => {
        logger.warn("api.player.update(): ", err);
        res.status(500).json({ message: `Internal Server Err: ${err}` });
      });
  });
};

// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------

import logger from "../../logger";
import config from "../../config";

// -----------------------------------------------------------------------------

export default (db, app) => {
  app.post("/api/players", (req, res) => {
    const newPlayer = req.body;
    logger.debug("post('/api/players'): newPlayer =", newPlayer);

    newPlayer.created = new Date();
    if (!newPlayer.status) newPlayer.status = "New";

    const err = Player.validatePlayer(newPlayer);
    if (err) {
      logger.debug("post('/api/players'): err =", err);
      res.status(422).json({ message: `Invalid requrest: ${err}` });
      return;
    }

    db.collection("players")
      .insertOne(Player.cleanupPlayer(newPlayer))
      .then(result =>
        db
          .collection("players")
          .find({ _id: result.insertedId })
          .limit(1)
          .next()
      )
      .then(newPlayer => {
        logger.debug("post('/api/players'): newPlayer =", newPlayer);
        res.json(newPlayer);
      })
      .catch(err => {
        logger.warn("post('/api/players'): err =", err);
        res.status(500).json({ message: `Internal Server Error: ${err}` });
      });
  });
};

// -----------------------------------------------------------------------------

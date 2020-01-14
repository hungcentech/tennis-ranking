// -----------------------------------------------------------------------------

import logger from "../../logger";
import config from "../../conf";

// -----------------------------------------------------------------------------

export default (db, app) => {
  app.post("/api/matches", (req, res) => {
    const newMatch = req.body;
    logger.debug("post('/api/matches'): newMatch =", newMatch);

    newMatch.created = new Date();
    if (!newMatch.status) newMatch.status = "New";

    const err = Match.validateMatch(newMatch);
    if (err) {
      logger.debug("post('/api/matches'): err =", err);
      res.status(422).json({ message: `Invalid requrest: ${err}` });
      return;
    }

    db.collection("matches")
      .insertOne(Match.cleanupMatch(newMatch))
      .then(result =>
        db
          .collection("matches")
          .find({ _id: result.insertedId })
          .limit(1)
          .next()
      )
      .then(newMatch => {
        logger.debug("post('/api/matches'): newMatch =", newMatch);
        res.json(newMatch);
      })
      .catch(err => {
        logger.warn("post('/api/matches'): err =", err);
        res.status(500).json({ message: `Internal Server Error: ${err}` });
      });
  });
};

// -----------------------------------------------------------------------------

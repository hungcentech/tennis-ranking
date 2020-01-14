// -----------------------------------------------------------------------------

import logger from "../../logger";
import config from "../../conf";

// -----------------------------------------------------------------------------

export default (db, app) => {
  app.put("/api/matches/:id", (req, res) => {
    let matchId;
    try {
      matchId = new ObjectId(req.params.id);
    } catch (error) {
      res.status(422).json({ message: `Invalid match ID format: ${error}` });
      return;
    }

    const match = req.body;
    logger.debug("put('api/matches/:id'): match =", match);
    delete match._id;

    const err = Match.validateMatch(match);
    if (err) {
      res.status(422).json({ message: `Invalid request: ${err}` });
      return;
    }

    db.collection("matches")
      .update({ _id: matchId }, Match.convertMatch(match))
      .then(() =>
        db
          .collection("matches")
          .find({ _id: matchId })
          .limit(1)
          .next()
      )
      .then(savedMatch => {
        res.json(savedMatch);
      })
      .catch(error => {
        logger.warn("api/match(): ", error);
        res.status(500).json({ message: `Internal Server Error: ${error}` });
      });
  });
};

// -----------------------------------------------------------------------------

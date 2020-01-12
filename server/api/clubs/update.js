// -----------------------------------------------------------------------------

import logger from "../../logger";
import config from "../../config";

// -----------------------------------------------------------------------------

export default (db, app) => {
  app.put("/api/clubs/:id", (req, res) => {
    let clubId;
    try {
      clubId = new ObjectId(req.params.id);
    } catch (error) {
      res.status(422).json({ message: `Invalid club id format: ${error}` });
      return;
    }

    const club = req.body;
    logger.debug("api.clubs.update(): club =", club);
    delete club._id;

    const err = Player.validatePlayer(club);
    if (err) {
      res.status(422).json({ message: `Invalid request: ${err}` });
      return;
    }

    db.collection("clubs")
      .update({ _id: clubId }, Player.convertPlayer(club))
      .then(() =>
        db
          .collection("clubs")
          .find({ _id: clubId })
          .limit(1)
          .next()
      )
      .then(savedPlayer => {
        res.json(savedPlayer);
      })
      .catch(error => {
        logger.warn("api.club.update(): ", error);
        res.status(500).json({ message: `Internal Server Error: ${error}` });
      });
  });
};

// -----------------------------------------------------------------------------

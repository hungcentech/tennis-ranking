// -----------------------------------------------------------------------------

import logger from "../../logger";

// -----------------------------------------------------------------------------

export default async (db, app, passport) => {
  app.get("/auth/facebook/cb/data_delete", (req, res) => {
    logger.debug("get('/auth/facebook/cb/data_delete'): query = " + JSON.stringify(req.query));
    res.redirect(302, "/tennisrankings/home");
  });
};

// -----------------------------------------------------------------------------

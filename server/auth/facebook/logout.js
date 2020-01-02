// -----------------------------------------------------------------------------

import logger from "../../logger";

// -----------------------------------------------------------------------------

export default async (db, app, passport) => {
  app.get("/auth/facebook/logout", (req, res) => {
    logger.debug("get('/auth/facebook/logout'): query = " + JSON.stringify(req.query));
    res.redirect(302, "/tennisrankings/home");
    res.status(202).json({ message: "/auth/facebook/logout: Being implemented." });
  });

  app.get("/auth/facebook/cb/logout", (req, res) => {
    logger.debug("get('/auth/facebook/cb/logout'): query = " + JSON.stringify(req.query));
    res.redirect(302, "/tennisrankings/home");
  });
};

// -----------------------------------------------------------------------------

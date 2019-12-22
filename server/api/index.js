// -----------------------------------------------------------------------------

import logger from "../logger";
import config from "../config";

import path from "path";

// import playerApiLoader from "./player";
import matchApiLoader from "./match";

// -----------------------------------------------------------------------------

export default async (db, app) => {
  try {
    logger.info("api(): ------------ Loading APIs... ---------");

    // await playerApiLoader(db, app);
    await matchApiLoader(db, app);

    app.get("*", (req, res) => {
      res.sendFile(path.resolve("static/index.html"));
    });

    logger.info("api(): ------------ APIs loaded ! -----------");
  } catch (err) {
    logger.warn("api(): Error: " + JSON.stringify(err));
    throw err;
  }
};

// -----------------------------------------------------------------------------

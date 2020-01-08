// -----------------------------------------------------------------------------

import express from "express";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import expressSession from "express-session";

import logger from "../logger";
import apiLoader from "./api";
import authLoader from "./auth";

// -----------------------------------------------------------------------------

export default async (db, app) => {
  try {
    logger.info("loaders/exp(): -- Loading Express... --------");

    await app.use(express.static("./static"));
    await app.use(bodyParser.json());
    await app.set("json spaces", 2);
    // await app.use(cookieParser());
    await app.use(expressSession({ secret: ";) tennis :D" }));

    await apiLoader(db, app);
    await authLoader(db, app);

    app.get("*", (req, res) => {
      res.sendFile(path.resolve("static/index.html"));
    });

    logger.info("loaders/exp(): -- Express loaded ! ----------");
    return app;
    //
  } catch (err) {
    logger.warn("loaders/exp(): Error: " + JSON.stringify(err));
    throw err;
  }

  // -----------------------------------------------------------------------------
};

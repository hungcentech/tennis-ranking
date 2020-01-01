// -----------------------------------------------------------------------------

import logger from "../logger";
import config from "../config";

import express from "express";
import bodyParser from "body-parser";

import apiLoader from "./api";

// -----------------------------------------------------------------------------

export default async (db, app) => {
  try {
    logger.info("loaders/exp(): -- Loading Express... --------");

    await app.use(express.static("./static"));
    await app.use(bodyParser.json());
    await app.set("json spaces", 2);

    await apiLoader(db, app);

    app.get("/login", (req, res) => {
      logger.debug("GET '/login', query = " + JSON.stringify(req.query));
      res.status(202).json({ message: "Happy New Year!" });
    });

    app.get("/logout", (req, res) => {
      logger.debug("GET '/login', query = " + JSON.stringify(req.query));
      res.status(202).json({ message: "Happy New Year!" });
    });

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

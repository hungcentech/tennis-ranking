// -----------------------------------------------------------------------------

import { MongoClient } from "mongodb";
import mongoose from "mongoose";

import logger from "../logger";
import config from "../config";

// -----------------------------------------------------------------------------

async function mongoConnect(serverUrl, dbName, options) {
  try {
    let dbUrl = serverUrl + dbName;
    logger.debug(`loaders/db.mongoConnect(): to ${dbUrl}`);

    const mongoClient = await MongoClient.connect(serverUrl, options);

    logger.info("loaders/db.mongoConnect(): success.");
    return mongoClient.db(dbName);
    //
  } catch (err) {
    logger.warn(`loaders/db.mongoConnect(): failed: ${err.message}`);
    return mongoConnect(serverUrl, dbName, options);
  }
}
// -----------------------------------------------------------------------------

async function mongooseConnect(serverUrl, dbName, options) {
  try {
    let dbUrl = serverUrl + dbName;
    logger.debug(`loaders/db.mongooseConnect(): to ${dbUrl}`);

    await mongoose.connect(dbUrl, options);

    logger.info("loaders/db.mongooseConnect(): success.");
    return mongoose.connection;
    //
  } catch (err) {
    logger.warn(`loaders/db.mongooseConnect(): failed: ${err.message}`);
    return mongooseConnect(serverUrl, dbName, options);
  }
}

// -----------------------------------------------------------------------------

export default async () => {
  try {
    logger.info("loaders/db(): --- Loading Db... -------------");

    var db;
    if (config.db.useMongoose) {
      db = await mongooseConnect(config.db.serverUrl, config.db.dbName, config.db.options);
    } else {
      db = await mongoConnect(config.db.serverUrl, config.db.dbName, config.db.options);
    }
    logger.info("loaders/db(): --- Db loaded ! ---------------");
    return db;
    //
  } catch (err) {
    logger.warn("loaders/db(): Error: " + JSON.stringify(err));
    throw err;
  }
};

// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------

import { MongoClient } from "mongodb";
import mongoose from "mongoose";

import logger from "../logger";
import conf from "../conf";

// -----------------------------------------------------------------------------

async function mongoConnect(serverUrl, dbName, options) {
  try {
    let dbUrl = serverUrl + dbName;
    logger.debug(`loaders.db.mongoConnect(): to ${dbUrl}`);

    const mongoClient = await MongoClient.connect(serverUrl, options);

    logger.info("loaders.db.mongoConnect(): success.");
    return mongoClient.db(dbName);
    //
  } catch (err) {
    logger.warn(`loaders.db.mongoConnect(): failed: ${err.message}`);
    return mongoConnect(serverUrl, dbName, options);
  }
}
// -----------------------------------------------------------------------------

async function mongooseConnect(serverUrl, dbName, options) {
  try {
    let dbUrl = serverUrl + dbName;
    logger.debug(`loaders.db.mongooseConnect(): to ${dbUrl}`);

    await mongoose.connect(dbUrl, options);

    logger.info("loaders.db.mongooseConnect(): success.");
    return mongoose.connection;
    //
  } catch (err) {
    logger.warn(`loaders.db.mongooseConnect(): failed: ${err.message}`);
    return mongooseConnect(serverUrl, dbName, options);
  }
}

// -----------------------------------------------------------------------------

export default async () => {
  try {
    logger.info("loaders.db(): --- Loading Db... -------------");

    // Create db connection
    var db;
    if (conf.db.useMongoose) {
      db = await mongooseConnect(conf.db.serverUrl, conf.db.dbName, conf.db.options);
    } else {
      db = await mongoConnect(conf.db.serverUrl, conf.db.dbName, conf.db.options);
    }

    // Create indexes
    db.collection("clubs").createIndex({ name: 1 }, { collation: { locale: "vi" } });
    db.collection("clubs").createIndex({ address: 1 }, { collation: { locale: "vi" } });
    db.collection("clubs").createIndex({ contact: 1 }, { collation: { locale: "vi" } });
    db.collection("clubs")
      .getIndexes()
      .then(indexes => {
        if (indexes) logger.info(`loaders.db(): current clubs indexes: ${JSON.stringify(indexes)}`);
      });
    db.collection("players").createIndex({ fbId: 1 });
    db.collection("players").createIndex({ name: 1 }, { collation: { locale: "vi" } });
    db.collection("players").createIndex({ facebook: 1 }, { collation: { locale: "vi" } });
    db.collection("players")
      .getIndexes()
      .then(indexes => {
        if (indexes) logger.info(`loaders.db(): current players indexes: ${JSON.stringify(indexes)}`);
      });

    logger.info("loaders.db(): --- Db loaded ! ---------------");
    return db;
    //
  } catch (err) {
    logger.warn("loaders.db(): Error: " + JSON.stringify(err));
    throw err;
  }
};

// -----------------------------------------------------------------------------

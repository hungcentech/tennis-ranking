// -----------------------------------------------------------------------------

import "babel-polyfill";
import SourceMapSupport from "source-map-support";
import express from "express";
import bodyParser from "body-parser";
import { MongoClient, ObjectId } from "mongodb";
import path from "path";
import Match from "./match.js";

// -----------------------------------------------------------------------------

SourceMapSupport.install();
var db;
var app = express();
app.use(express.static("./static"));
app.use(bodyParser.json());
app.set("json spaces", 2);

// -----------------------------------------------------------------------------

// if (process.env.NODE_ENV !== "production") {
//   const webpack = require("webpack");
//   const webpackDevMiddleware = require("webpack-dev-middleware");
//   const webpackHotMiddleware = require("webpack-hot-middleware");
//   const config = require("../webpack.config.js");
//   config.mode = "development";
//   config.entry.app.push("webpack-hot-middleware/client", "webpack/hot/only-dev-server");
//   config.plugins.push(new webpack.HotModuleReplacementPlugin());
//   const bundler = webpack(config);
//   app.use(webpackDevMiddleware(bundler, { noInfo: true }));
//   app.use(webpackHotMiddleware(bundler, { log: console.log }));
// }

// -----------------------------------------------------------------------------

app.get("/api/matches", (req, res) => {
  const filter = {};
  if (req.query.status) filter.status = req.query.status;
  // if (req.query.effort_lte || req.query.effort_gte) filter.effort = {};
  // if (req.query.effort_gte) filter.effort.$gte = parseInt(req.query.effort_gte, 10);
  // if (req.query.effort_lte) filter.effort.$lte = parseInt(req.query.effort_lte, 10);

  db.collection("matches")
    .find(filter)
    .toArray()
    .then(matches => {
      const metaData = { total_count: matches.length };
      const resObj = { meta: metaData, records: matches };
      console.log(
        `app.get('/api/matches'): filter = ${JSON.stringify(filter)}, records found = ${
          resObj.records.length
        }`
      );
      res.json(resObj);
    })
    .catch(err => {
      console.log("get('/api/matches'): err =", err);
      res.status(500).json({ message: `!!! Internal Server Error: ${err}` });
    });
});

// -----------------------------------------------------------------------------

app.get("/api/matches/:id", (req, res) => {
  let matchId;
  try {
    matchId = new ObjectId(req.params.id);
  } catch (error) {
    res.status(422).json({ message: `Invalid match ID format: ${error}` });
    return;
  }
  db.collection("matches")
    .find({ _id: matchId })
    .limit(1)
    .next()
    .then(match => {
      if (!match) res.status(404).json({ message: `No such match: ${matchId}` });
      else res.json(match);
    })
    .catch(error => {
      console.log(error);
      res.status(500).json({ message: `Internal Server Error: ${error}` });
    });
});

// -----------------------------------------------------------------------------

app.get("*", (req, res) => {
  res.sendFile(path.resolve("static/index.html"));
});

// -----------------------------------------------------------------------------

app.post("/api/matches", (req, res) => {
  const newMatch = req.body;
  console.log("post('/api/matches'): newMatch =", newMatch);

  newMatch.created = new Date();
  if (!newMatch.status) newMatch.status = "New";

  const err = Match.validateMatch(newMatch);
  if (err) {
    console.log("post('/api/matches'): err =", err);
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
      console.log("post('/api/matches'): newMatch =", newMatch);
      res.json(newMatch);
    })
    .catch(err => {
      console.log("post('/api/matches'): err =", err);
      res.status(500).json({ message: `Internal Server Error: ${err}` });
    });
});

// -----------------------------------------------------------------------------

app.put("/api/matches/:id", (req, res) => {
  let matchId;
  try {
    matchId = new ObjectId(req.params.id);
  } catch (error) {
    res.status(422).json({ message: `Invalid match ID format: ${error}` });
    return;
  }

  const match = req.body;
  console.log("put('api/matches/:id'): match =", match);
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
      console.log(error);
      res.status(500).json({ message: `Internal Server Error: ${error}` });
    });
});

// -----------------------------------------------------------------------------

app.delete("/api/matches/:id", (req, res) => {
  let matchId;
  try {
    matchId = new ObjectId(req.params.id);
  } catch (error) {
    res.status(422).json({ message: `Invalid match ID format: ${error}` });
    return;
  }
  db.collection("matches")
    .deleteOne({ _id: matchId })
    .then(deleteResult => {
      if (deleteResult.result.n === 1) res.json({ status: "OK" });
      else res.json({ status: "Warning: object not found" });
    })
    .catch(error => {
      console.log(error);
      res.status(500).json({ message: `Internal Server Error: ${error}` });
    });
});

// -----------------------------------------------------------------------------

const appStart = function() {
  const url = "mongodb://localhost:27017";
  const dbName = "tennis-ranking";

  MongoClient.connect(url, { useUnifiedTopology: true })
    .then(client => {
      console.log("appStart(): Connected successfully to mongodb server.");
      db = client.db(dbName);

      app.listen(3000, () => {
        console.log("appStart(): Tennis-ranking server started. Listening on port: 3000");
      });
    })
    .catch(err => {
      console.log("appStart(): DB connection error:", err);
    });
};

// -------------------------------------

appStart();

// -----------------------------------------------------------------------------

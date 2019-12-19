"use strict";

require("babel-polyfill");

var _sourceMapSupport = _interopRequireDefault(require("source-map-support"));

var _express = _interopRequireDefault(require("express"));

var _bodyParser = _interopRequireDefault(require("body-parser"));

var _mongodb = require("mongodb");

var _path = _interopRequireDefault(require("path"));

var _match = _interopRequireDefault(require("./match.js"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

// -----------------------------------------------------------------------------
// -----------------------------------------------------------------------------
_sourceMapSupport["default"].install();

var db;
var app = (0, _express["default"])();
app.use(_express["default"]["static"]("./static"));
app.use(_bodyParser["default"].json());
app.set("json spaces", 2); // -----------------------------------------------------------------------------
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

app.get("/api/matches", function (req, res) {
  var filter = {};
  if (req.query.status) filter.status = req.query.status; // if (req.query.effort_lte || req.query.effort_gte) filter.effort = {};
  // if (req.query.effort_gte) filter.effort.$gte = parseInt(req.query.effort_gte, 10);
  // if (req.query.effort_lte) filter.effort.$lte = parseInt(req.query.effort_lte, 10);

  db.collection("matches").find(filter).toArray().then(function (matches) {
    var metaData = {
      total_count: matches.length
    };
    var resObj = {
      meta: metaData,
      records: matches
    };
    console.log("app.get('/api/matches'): filter = ".concat(JSON.stringify(filter), ", records found = ").concat(resObj.records.length));
    res.json(resObj);
  })["catch"](function (err) {
    console.log("get('/api/matches'): err =", err);
    res.status(500).json({
      message: "!!! Internal Server Error: ".concat(err)
    });
  });
}); // -----------------------------------------------------------------------------

app.get("/api/matches/:id", function (req, res) {
  var matchId;

  try {
    matchId = new _mongodb.ObjectId(req.params.id);
  } catch (error) {
    res.status(422).json({
      message: "Invalid match ID format: ".concat(error)
    });
    return;
  }

  db.collection("matches").find({
    _id: matchId
  }).limit(1).next().then(function (match) {
    if (!match) res.status(404).json({
      message: "No such match: ".concat(matchId)
    });else res.json(match);
  })["catch"](function (error) {
    console.log(error);
    res.status(500).json({
      message: "Internal Server Error: ".concat(error)
    });
  });
}); // -----------------------------------------------------------------------------

app.get("*", function (req, res) {
  res.sendFile(_path["default"].resolve("static/index.html"));
}); // -----------------------------------------------------------------------------

app.post("/api/matches", function (req, res) {
  var newMatch = req.body;
  console.log("post('/api/matches'): newMatch =", newMatch);
  newMatch.created = new Date();
  if (!newMatch.status) newMatch.status = "New";

  var err = _match["default"].validateMatch(newMatch);

  if (err) {
    console.log("post('/api/matches'): err =", err);
    res.status(422).json({
      message: "Invalid requrest: ".concat(err)
    });
    return;
  }

  db.collection("matches").insertOne(_match["default"].cleanupMatch(newMatch)).then(function (result) {
    return db.collection("matches").find({
      _id: result.insertedId
    }).limit(1).next();
  }).then(function (newMatch) {
    console.log("post('/api/matches'): newMatch =", newMatch);
    res.json(newMatch);
  })["catch"](function (err) {
    console.log("post('/api/matches'): err =", err);
    res.status(500).json({
      message: "Internal Server Error: ".concat(err)
    });
  });
}); // -----------------------------------------------------------------------------

app.put("/api/matches/:id", function (req, res) {
  var matchId;

  try {
    matchId = new _mongodb.ObjectId(req.params.id);
  } catch (error) {
    res.status(422).json({
      message: "Invalid match ID format: ".concat(error)
    });
    return;
  }

  var match = req.body;
  console.log("put('api/matches/:id'): match =", match);
  delete match._id;

  var err = _match["default"].validateMatch(match);

  if (err) {
    res.status(422).json({
      message: "Invalid request: ".concat(err)
    });
    return;
  }

  db.collection("matches").update({
    _id: matchId
  }, _match["default"].convertMatch(match)).then(function () {
    return db.collection("matches").find({
      _id: matchId
    }).limit(1).next();
  }).then(function (savedMatch) {
    res.json(savedMatch);
  })["catch"](function (error) {
    console.log(error);
    res.status(500).json({
      message: "Internal Server Error: ".concat(error)
    });
  });
}); // -----------------------------------------------------------------------------

app["delete"]("/api/matches/:id", function (req, res) {
  var matchId;

  try {
    matchId = new _mongodb.ObjectId(req.params.id);
  } catch (error) {
    res.status(422).json({
      message: "Invalid match ID format: ".concat(error)
    });
    return;
  }

  db.collection("matches").deleteOne({
    _id: matchId
  }).then(function (deleteResult) {
    if (deleteResult.result.n === 1) res.json({
      status: "OK"
    });else res.json({
      status: "Warning: object not found"
    });
  })["catch"](function (error) {
    console.log(error);
    res.status(500).json({
      message: "Internal Server Error: ".concat(error)
    });
  });
}); // -----------------------------------------------------------------------------

var appStart = function appStart() {
  var url = "mongodb://localhost:27017";
  var dbName = "tennis-ranking";

  _mongodb.MongoClient.connect(url, {
    useUnifiedTopology: true
  }).then(function (client) {
    console.log("appStart(): Connected successfully to mongodb server.");
    db = client.db(dbName);
    app.listen(3000, function () {
      console.log("appStart(): Tennis-ranking server started. Listening on port: 3000");
    });
  })["catch"](function (err) {
    console.log("appStart(): DB connection error:", err);
  });
}; // -------------------------------------


appStart(); // -----------------------------------------------------------------------------
//# sourceMappingURL=server.js.map
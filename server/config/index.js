// -----------------------------------------------------------------------------

export default {
  // Webpack environment
  webpack: {
    // env: "development"
  },

  // Log level
  logger: {
    console: {
      level: "debug"
    },
    file: {
      level: "debug",
      path: "/data/tennis-rankings/log/tennis-rankings-%DATE%.log"
    }
  },

  // MongoDB configs
  db: {
    useMongoose: true,
    serverUrl: "mongodb://localhost/",
    dbName: "tennis-rankings",
    options: {
      useNewUrlParser: true,
      useCreateIndex: true,
      useUnifiedTopology: true
    }
  },

  // Express server port
  port: 3000,

  // API configs
  api: {
    prefix: "/apis"
  }

  //
};

// -----------------------------------------------------------------------------

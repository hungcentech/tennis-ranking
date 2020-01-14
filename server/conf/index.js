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

  // App domain:
  //   localhost => for babel debugger
  //   real domain => for mobile phone use
  appDomain: "http://localhost",
  // appDomain: "https://bme.hust.edu.vn",

  // App URL
  appUrl: "/tennisrankings",

  // API configs
  api: {
    clubs: { url: "/api/clubs" },
    players: { url: "/api/players" }
  },

  // Auth
  auth: {
    facebook: {
      clientId: "2600052983556145",
      clientSecret: "6ed2042383cbca0addd8ab764c2e6cca",
      login: {
        url: "/auth/facebook/login",
        cbUrl: "/auth/facebook/cb/login",
        cbUrlSuccess: "/auth/facebook/cb/login/success",
        cbUrlFailure: "/auth/facebook/cb/login/failure"
      }
    }
  }
};

// -----------------------------------------------------------------------------

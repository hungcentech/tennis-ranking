var path = require("path");

module.exports = {
  entry: {
    app: ["./src/App.jsx"]
  },
  output: {
    filename: "app.bundle.js",
    path: __dirname + "/static"
  },
  optimization: {
    namedChunks: true,
    splitChunks: {
      cacheGroups: {
        commons: {
          test: /[\\/]node_modules[\\/]/,
          name: "vendors",
          chunks: "all"
        }
      }
    }
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader"
        }
      }
    ]
  },
  devServer: {
    port: 8000,
    proxy: {
      "/auth/*": {
        target: "http://localhost:3000"
      },
      "/api/*": {
        target: "http://localhost:3000"
      }
    },
    historyApiFallback: true,
    contentBase: "static",
    hot: true
  },
  devtool: "source-map",
  plugins: []
};

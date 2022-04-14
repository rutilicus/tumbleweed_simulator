const path = require('path');

module.exports = {
  mode: "production",
  entry: "./ts/main.ts",
  output: {
    path: path.join(__dirname, "docs/js"),
    filename: "main.js"
  },
  module: {
    rules: [{
      test: /\.ts$/,
      use: "ts-loader"
    }]
  },
  resolve: {
    modules: [
      "node_modules"
    ],
    extensions: [
      ".ts",
      ".js"
    ]
  }
};

const path = require("path");

module.exports = {
  entry: "/sandbox/other/components/TestApp.js",
  output: {
    path: path.resolve(__dirname, "assetsFront"),
    filename: "[name].js"
  },
  resolve: {
    extensions: [".js", ".jsx"]
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
          options: {
            presets: ["@babel/preset-react"]
          }
        }
      }
    ]
  }
};

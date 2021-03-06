const path = require("path");

module.exports = {
  entry: "/sandbox/other/components/App2.js",
  output: {
    path: path.resolve(__dirname, "assets"),
    filename: "[name].js"
  },
  resolve: {
    modules: ["node_modules"],
    descriptionFiles: ["package.json"],
    extensions: [".js", ".jsx"]
  },
  externals: {
    react: "react",
    "react-dom": "react-dom"
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

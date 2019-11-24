const express = require("express");

const app = express();

const constants = require("/sandbox/src/libs/Constants.js");

const template = require("/sandbox/src/components/templateReact.js");

const ssrRouting = express.Router();

ssrRouting.route("/login").get(function name(req, res) {
  res.send(
    template("https://smers.sse.codesandbox.io/main.js", {
      metaTitle: "SimplePTV",
      metaDesc: "The cheapiest ptv in town",
      img: constants.logoImg,
      title: "Im a title"
    })
  );
});

ssrRouting.route("/test").get(function name(req, res) {
  res.send("Hi");
});
module.exports = ssrRouting;

const express = require("express");

const app = express();

const constants = require("../libs/Constants.js");

import React from "react";

const template = require("/sandbox/src/components/template.js");

import { renderToString } from "react-dom/server";

import { Login } from "/sandbox/other/components/Login.js";
const ssrRouting = express.Router();

ssrRouting.route("/login").get(function name(req, res) {
  let loginForm = renderToString(<Login />);

  res.send(
    template(
      loginForm,
      "Something",
      "Esto es una descripcion",
      constants.logoImg
    )
  );
});

module.exports = ssrRouting;

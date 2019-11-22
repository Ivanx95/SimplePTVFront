import React from "react";
import { renderToString } from "react-dom/server";

//var App = require("./components/App.js");
// var App = require("./src/components/App.jsx");
import { App2 } from "/sandbox/other/components/App2.js";

export function ReactServer(initialState) {
  let content = renderToString(<App2 dt={initialState.tagId} />);

  return content;
}

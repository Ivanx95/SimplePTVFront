var React = require("react");
var { renderToString } = require("react-dom/server");

var App = require("./components/App.js");
// var App = require("./src/components/App.jsx");

module.exports = function render(initialState) {
  var provider = App(initialState);

  let content = renderToString(provider);

  return content;
};

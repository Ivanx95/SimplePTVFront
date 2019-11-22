"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ReactServer = ReactServer;

var _react = _interopRequireDefault(require("react"));

var _server = require("react-dom/server");

var _App = require("/sandbox/other/components/App2.js");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

//var App = require("./components/App.js");
// var App = require("./src/components/App.jsx");
function ReactServer(initialState) {
  var content = (0, _server.renderToString)(_react["default"].createElement(_App.App2, {
    dt: "ninu"
  }));
  return content;
}
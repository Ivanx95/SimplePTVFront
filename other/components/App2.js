"use strict";

var _reactDom = _interopRequireDefault(require("react-dom"));

var _TestApp = _interopRequireDefault(require("/sandbox/other/components/TestApp.js"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

_reactDom["default"].render(React.createElement(_TestApp["default"], null), document.getElementById("root"));
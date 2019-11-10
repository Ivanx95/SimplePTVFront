var React = require("react");

module.exports = function exect(props) {
  return React.createElement(
    "div",
    { className: "columns" },
    React.createElement(
      "div",
      { className: "column" },
      React.createElement("div", { className: "field" }, [
        React.createElement(
          "label",
          { className: "label", htmlFor: "nombre" },
          props.person
        ),
        React.createElement(
          "div",
          { className: "control" },
          React.createElement(
            "input",
            { className: "input", type: "text", name: "nombre" },
            null
          )
        )
      ])
    )
  );
};

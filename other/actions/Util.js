"use strict";

module.exports = function broadcast(data, sender, connections) {
  connections.forEach(function (item, key, map) {
    item.ws.send(JSON.stringify({
      content: data,
      usr: sender
    }));
  });
};
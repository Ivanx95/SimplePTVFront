module.exports = function broadcast(data, sender, connections) {
  connections.forEach((item, key, map) => {
    item.ws.send(JSON.stringify({ content: data, usr: sender }));
  });
};

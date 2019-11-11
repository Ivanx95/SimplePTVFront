const express = require("express");
const app = express();
const apiRouter = express.Router();

const broadcast = require("/sandbox/src/actions/Util.js");
const master = "Master";
apiRouter.route("/").get(function name(req, res) {
  let connections = req.connections;
  if (connections !== undefined) {
    console.log(connections);
    res.send("Connections");
  } else {
    res.send("Hello World!");
  }
});

app.get("/info/connections", function(req, res) {
  //look on server

  let connections = req.connections;
  let usersArray = [];
  connections.forEach((value, key, map) => {
    usersArray.push(key);
  });
  res.status(200).send(usersArray);
});

app.post("/api/publish/user/:user", function(req, res) {
  var data = req.body;
  var user = req.params.user;

  //Mocked type of user
  let tyoeOfDestiny = "web";

  let connections = req.connections;

  let connection = connections.get(user);

  if (connection !== undefined) {
    let wsAux = connection.ws;
    let userChannel = connection.channel;

    let msg = new Message(
      uuidv1(),
      user,
      tyoeOfDestiny,
      userChannel,
      master,
      data,
      200
    );

    wsAux.send(JSON.stringify(msg));
    res.status(200).send("everything ok");
  } else {
    if (queue.get(user) === undefined) {
      let mapAux = new Map();
      mapAux.set(master, data);
      queue.set(user, new Array(mapAux));
    } else {
      let mapAux = new Map();
      mapAux.set(master, data);
      queue.get(user).push(mapAux);
    }

    res.status(200).send("On queue msg");
  }

  //look on server
});

app.get("/api/:channel/broadcast/:data", function(req, res) {
  let connections = req.connections;
  broadcast(req.params.data, master, connections);
  res.status(200).send("everything ok");
});

module.exports = apiRouter;

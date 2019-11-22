"use strict";

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance"); }

function _iterableToArray(iter) { if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } }

var uuidv1 = require("uuid/v1");

var template = require("./components/template.js");

var WebSocket = require("ws");

var ReactServer = require("/sandbox/other/components/server.js");

var express = require("express");

var app = express();

var broadcast = require("./actions/Util.js");

var Message = require("./model/webSocketModel.js");

var User = require("./model/User.js");

var http = require("http");

var server = http.createServer(app);
var connections = new Map();
var queue = new Map();

var apiRouter = require("./routes/routes.js");

var allowedDomains = ["http://localhost:8080"];
server.listen(process.env.PORT || 8999, function () {
  console.log("Server started on port ".concat(server.address().port, " :)"));
});
var wss = new WebSocket.Server({
  server: server
});
app.use(express["static"](__dirname + "/public/"));
app.use(express.json()); //Secur''ing app

app.use(function (req, res, next) {
  res.setHeader("Access-Control-Allow-Origin", allowedDomains);
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, PATCH, DELETE");
  res.setHeader("Access-Control-Allow-Headers", "X-Requested-With, Content-Type, Accept");
  next();
});
wss.on("connection", function connection(ws, req) {
  console.log("new connection");
  var clientAddress = req.headers["x-forwarded-for"] || req.connection.remoteAddress;
  ws.on("message", function (msg) {
    var data = JSON.parse(msg);
    var user = data.user;
    connections.set(user, new User(ws, data.channel));

    if (user === undefined) {
      var unauthorizedAccessmsg = new Message(uuidv1(), data.destiny, data.typeDestiny, data.channel, clientAddress, data.content, 401);
      console.log("Connection attempted of un-verifies user");
      console.log(unauthorizedAccessmsg);
      unauthorizedAccessmsg.content = "No access alowed";
      ws.send(JSON.stringify(unauthorizedAccessmsg));
      ws.close();
      return;
    } //Subscribe


    if (data.channel === "chat") {
      if (connections.get(user) === undefined) {
        //Check if device it's registered in DB
        connections.set(user, new User(ws, data.channel));

        if (queue.get(user) !== undefined) {
          sendQueueMessages(queue, user, ws);
        }

        if (queue.get(data.channel) !== undefined) {
          sendQueueMessages(queue, data.channel, ws);
        }
      }
    }

    if (data.typeOrigin === "ptv") {
      if (connections.get(user) === undefined) {
        //Check if device it's registered in DB
        connections.set(user, new User(ws, data.channel));
      }
    }

    if (data.sincronize === true) {
      if (queue.get(user) !== undefined) {
        sendQueueMessages(queue, user, ws);
      }

      if (queue.get(data.channel) !== undefined) {
        sendQueueMessages(queue, data.channel, ws);
      }
    } //Ackowladge of others, connections


    if ( //data.typeOrigin === "chat" &&
    data.login !== undefined && user !== undefined) {
      console.log("Here");
      ws.send(JSON.stringify({
        connections: _toConsumableArray(connections.keys())
      }));
      connections.forEach(function (item, key, map) {
        if (item.ws !== ws) {
          item.ws.send(JSON.stringify({
            connections: [user]
          }));
        }
      });
    } else if (data.content !== undefined) {
      //Online to supervisor connections
      // ws.send(JSON.stringify({ connections: [...connections.keys()] }));
      broadcast(data.content, user, connections);
    }
  });

  ws.onerror = function (ev) {
    console.log("An error occurred. Sorry for that.");
    console.log(ev);
  };

  ws.on("close", function (event) {
    remove(connections, ws);
    console.log(event);
  });
});
app.use("/api", function (req, res, next) {
  req.connections = connections;
  next();
});
app.use("/api", apiRouter);
app.get("/hello", function (req, res) {
  res.send("Hello World!");
});
app.get("/", function (req, res) {
  res.sendFile(__dirname + "/public/index.html");
});
app.get("/react/:coupon/:tagId", function (req, res) {
  var img = req.query.img; //look on server

  img = "https://e3obb.sse.codesandbox.io/" + img + ".png";
  res.send(template(ReactServer({
    person: req.params.tagId,
    couponCode: req.params.coupon
  }), req.params.coupon, "Esto es una descripcion", img));
}); //app.get("/public/:resources", function(req, res) {
//res.sendFile(__dirname + "/public/" + req.params.resources);
//});

function remove(map, element) {
  map.forEach(function (value, key, other) {
    if (value.ws === element) {
      console.log("Element deleted");
      map["delete"](key);
    }
  });
}

function sendQueueMessages(queue, user, ws) {
  var queueData = queue.get(user);
  queueData.forEach(function (oldMsg) {
    oldMsg.forEach(function (value, key, map) {
      ws.send(JSON.stringify({
        content: value,
        usr: key
      }));
    });
  });
  queue.set(user, new Array(1));
}
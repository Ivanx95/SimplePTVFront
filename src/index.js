const path = require("path");

const template = require("./components/template.js");

const WebSocket = require("ws");

const ReactServer = require("./server.js");
const express = require("express");

const app = express();

const http = require("http");

const server = http.createServer(app);

const users = new Map();
const queue = new Map();
const master = "Master";

server.listen(process.env.PORT || 8999, () => {
  console.log(`Server started on port ${server.address().port} :)`);
});

const wss = new WebSocket.Server({ server });

app.use(express.static(__dirname + "/public/"));

wss.on("connection", function connection(ws) {
  console.log("new connection");

  ws.on("message", function(msg) {
    var data = JSON.parse(msg);

    if (users.get(data.user) === undefined) {
      users.set(data.user, ws);

      console.log(data);
      if (queue.get(data.user) !== undefined) {
        console.log(queue);
        let queueData = queue.get(data.user);
        queueData.forEach(oldMsg => {
          oldMsg.forEach((value, key, map) => {
            ws.send(JSON.stringify({ chat: value, usr: key }));
          });
        });

        queue.set(data.user, new Array(1));
      }
    }
    if (data.login !== undefined && data.user !== undefined) {
      ws.send(JSON.stringify({ usr: [...users.keys()] }));
    } else if (data.chat !== undefined) {
      console.log(data);
      broadcast(data.chat, data.user);
    }
  });

  ws.onerror = function(ev) {
    console.log("An error occurred. Sorry for that.");
    console.log(ev);
  };
  ws.on("close", function(event) {
    remove(users, ws);
    console.log(event);
  });
});

app.get("/hello", function(req, res) {
  res.send("Hello World!");
});

app.get("/", function(req, res) {
  res.sendFile(__dirname + "/public/index.html");
});

app.get("/react/:coupon/:tagId", function(req, res) {
  var img = req.query.img;

  //look on server
  img = "https://e3obb.sse.codesandbox.io/" + img + ".png";
  res.send(
    template(
      ReactServer({ person: req.params.tagId, couponCode: req.params.coupon }),
      req.params.coupon,
      "Esto es una descripcion",
      img
    )
  );
});

app.get("/api/:user/:data", function(req, res) {
  var data = req.params.data;
  var user = req.params.user;

  let wsAux = users.get(user);

  if (wsAux !== undefined) {
    wsAux.send(JSON.stringify({ chat: data, usr: master }));
    res.status(200).send("everything ok");
  } else {
    if (queue.get(user) == undefined) {
      queue.set(user, new Array());
    } else {
      let mapAux = new Map();
      mapAux.set(master, data);
      queue.get(user).push(mapAux);
    }

    res.status(200).send("On queue msg");
  }

  //look on server
});

app.get("/api/:group/broadcast/:data", function(req, res) {
  broadcast(req.params.data, master);
  res.status(200).send("everything ok");

  //look on server
});

app.get("/api/users", function(req, res) {
  //look on server
  let usersArray = [];
  users.forEach((value, key, map) => {
    usersArray.push(key);
  });
  res.status(200).send(usersArray);
});

//app.get("/public/:resources", function(req, res) {
//res.sendFile(__dirname + "/public/" + req.params.resources);
//});
function broadcast(data, user) {
  users.forEach((wsAux, key, map) => {
    wsAux.send(JSON.stringify({ chat: data, usr: user }));
  });
}

function remove(map, element) {
  map.forEach((value, key, other) => {
    if (value == element) {
      console.log("Element deleted");
      map.delete(key);
    }
  });
}

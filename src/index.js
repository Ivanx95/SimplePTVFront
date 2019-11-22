const uuidv1 = require("uuid/v1");

const template = require("./components/template.js");

const WebSocket = require("ws");

const { ReactServer } = require("/sandbox/other/components/server.js");
const express = require("express");

const app = express();

const broadcast = require("./actions/Util.js");

const Message = require("./model/webSocketModel.js");

const User = require("./model/User.js");
const http = require("http");

const server = http.createServer(app);

const connections = new Map();
const queue = new Map();

const apiRouter = require("./routes/routes.js");
const ssrRouting = require("/sandbox/other/routes/ServerSideRendering.js");

const allowedDomains = ["http://localhost:8080"];
server.listen(process.env.PORT || 8999, () => {
  console.log(`Server started on port ${server.address().port} :)`);
});

const wss = new WebSocket.Server({ server });

app.use(express.static(__dirname + "/public/"));
app.use(express.json());

//Secur''ing app
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", allowedDomains);
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, OPTIONS, PUT, PATCH, DELETE"
  );
  res.setHeader(
    "Access-Control-Allow-Headers",
    "X-Requested-With, Content-Type, Accept"
  );
  next();
});

wss.on("connection", function connection(ws, req) {
  console.log("new connection");

  let clientAddress =
    req.headers["x-forwarded-for"] || req.connection.remoteAddress;

  ws.on("message", function(msg) {
    var data = JSON.parse(msg);

    let user = data.user;

    connections.set(user, new User(ws, data.channel));
    if (user === undefined) {
      let unauthorizedAccessmsg = new Message(
        uuidv1(),
        data.destiny,
        data.typeDestiny,
        data.channel,
        clientAddress,
        data.content,
        401
      );
      console.log("Connection attempted of un-verifies user");
      console.log(unauthorizedAccessmsg);

      unauthorizedAccessmsg.content = "No access alowed";

      ws.send(JSON.stringify(unauthorizedAccessmsg));
      ws.close();

      return;
    }

    //Subscribe

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
    }

    //Ackowladge of others, connections
    if (
      //data.typeOrigin === "chat" &&
      data.login !== undefined &&
      user !== undefined
    ) {
      console.log("Here");

      ws.send(JSON.stringify({ connections: [...connections.keys()] }));

      connections.forEach((item, key, map) => {
        if (item.ws !== ws) {
          item.ws.send(JSON.stringify({ connections: [user] }));
        }
      });
    } else if (data.content !== undefined) {
      //Online to supervisor connections
      // ws.send(JSON.stringify({ connections: [...connections.keys()] }));
      broadcast(data.content, user, connections);
    }
  });

  ws.onerror = function(ev) {
    console.log("An error occurred. Sorry for that.");
    console.log(ev);
  };
  ws.on("close", function(event) {
    remove(connections, ws);
    console.log(event);
  });
});

app.use("/api", function(req, res, next) {
  req.connections = connections;
  next();
});

app.use("/api", apiRouter);

app.use("/ssr", function(req, res, next) {
  next();
});

app.use("/ssr", ssrRouting);

app.get("/hello", function(req, res) {
  res.send("Hello World!");
});

app.get("/", function(req, res) {
  res.sendFile(__dirname + "/public/index.html");
});

// app.get("/react/:coupon/:tagId", function(req, res) {
//   var img = req.query.img;

//   //look on server
//   img = "https://e3obb.sse.codesandbox.io/" + img + ".png";
//   res.send(
//     template(
//       ReactServer({ tagId: req.params.tagId, couponCode: req.params.coupon }),
//       req.params.coupon,
//       "Esto es una descripcion",
//       img
//     )
//   );
// });

//app.get("/public/:resources", function(req, res) {
//res.sendFile(__dirname + "/public/" + req.params.resources);
//});

function remove(map, element) {
  map.forEach((value, key, other) => {
    if (value.ws === element) {
      console.log("Element deleted");
      map.delete(key);
    }
  });
}

function sendQueueMessages(queue, user, ws) {
  let queueData = queue.get(user);
  queueData.forEach(oldMsg => {
    oldMsg.forEach((value, key, map) => {
      ws.send(JSON.stringify({ content: value, usr: key }));
    });
  });

  queue.set(user, new Array(1));
}

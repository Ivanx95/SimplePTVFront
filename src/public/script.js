document.addEventListener("DOMContentLoaded", () => {
  let documentTitle = "SimpleChat ";

  var logged = false;
  var mySession;
  const $navBarBurguer = Array.prototype.slice.call(
    document.querySelectorAll(".navbar-burger"),
    0
  );
  if ($navBarBurguer.length > 0) {
    $navBarBurguer.forEach(el => {
      el.addEventListener("click", () => {
        // Get the target from the "data-target" attribute
        const target = el.dataset.target;
        const $target = document.getElementById(target);

        // Toggle the "is-active" class on both the "navbar-burger" and the "navbar-menu"
        el.classList.toggle("is-active");
        $target.classList.toggle("is-active");
      });
    });
  }
  var users = [];
  var response = document.querySelectorAll("#responseSpan")[0];

  let chatUI = document.querySelectorAll("#chatContainer")[0];
  let usersConnected = document.querySelectorAll("#usersConnected")[0];
  let ws = new WebSocket("wss://smers.sse.codesandbox.io/"); // event emmited when connected
  ws.onopen = function() {
    console.log("websocket is connected ..."); // sending a send event to websocket server
  }; // event emmited when receiving message
  ws.onmessage = function(ev) {
    // response.innerHTML = ev.data;

    let data = JSON.parse(ev.data);

    console.log(data);
    if (data.usr !== undefined) {
      var usersAux = data.usr;

      if (data.content !== undefined) {
        var chatMsg = data.content;

        newExcitingAlerts = function() {
          var oldTitle = document.title;
          var msg = documentTitle + "new message from " + usersAux;
          var timeoutId;
          var blink = function() {
            document.title = document.title == msg ? " " : msg;
          };
          var clear = function() {
            clearInterval(timeoutId);
            document.title = oldTitle;
            window.onmousemove = null;
            timeoutId = null;
          };
          return function() {
            if (!timeoutId) {
              timeoutId = setInterval(blink, 1000);
              window.onmousemove = clear;
            }
          };
        };

        newExcitingAlerts();
        appendMsg(usersAux, chatMsg);
      }
    } else if (data.connections !== undefined) {
      var connections = data.connections;
      connections.forEach(function(e) {
        appendUser(e);
      });
    }
  };

  ws.onclose = function(evt) {
    appendMsg("Server", "Connection close with server");
    logOff();
  };
  var btnSend = document.querySelectorAll("#sendBtn")[0];

  var labelName = document.querySelectorAll("#labelName")[0];
  var inputLog = document.querySelectorAll("#logInput")[0];

  inputLog.addEventListener("keyup", function(event) {
    if (event.key === "Enter") {
      send();
    }
  });
  btnSend.addEventListener("click", () => {
    send();
  });

  function send() {
    if (inputLog.value !== "") {
      if (!logged) {
        logOn();
        ws.send(JSON.stringify({ user: inputLog.value, login: true }));
      } else {
        ws.send(JSON.stringify({ user: mySession, content: inputLog.value }));
      }
      inputLog.value = "";
    }
  }

  function appendUser(user) {
    let panelBlockAnchor = document.createElement("a");
    panelBlockAnchor.classList.add("panel-block");
    panelBlockAnchor.classList.add("is-active");

    let spanIcon = document.createElement("span");

    spanIcon.classList.add("panel-icon");
    spanIcon.classList.add("has-text-success");

    let iIcon = document.createElement("i");

    iIcon.classList.add("fas");
    iIcon.classList.add("fa-circle");

    iIcon.attributes["aria-hidden"] = "true";

    spanIcon.appendChild(iIcon);

    let divAux = document.createElement("div");
    divAux.innerHTML = user;

    panelBlockAnchor.appendChild(spanIcon);

    panelBlockAnchor.appendChild(divAux);

    usersConnected.appendChild(panelBlockAnchor);
  }
  function appendMsg(user, data) {
    let columnsContainerEl = document.createElement("div");

    columnsContainerEl.classList.add("columns");

    let incomingMsgColumnel = document.createElement("div");

    incomingMsgColumnel.classList.add("column");
    incomingMsgColumnel.classList.add("is-three-quarters");

    let fullColumnEl = document.createElement("div");

    fullColumnEl.classList.add("column");

    let articleAux = document.createElement("article");
    articleAux.classList.add("message");
    // articleAux.setAttribute("style", "width:85%;");

    if (user === "Server") {
      articleAux.classList.add("is-warning");
      columnsContainerEl.appendChild(fullColumnEl);
      fullColumnEl.appendChild(articleAux);
    } else if (user === mySession) {
      articleAux.classList.add("is-primary");
      columnsContainerEl.appendChild(fullColumnEl);
      columnsContainerEl.appendChild(incomingMsgColumnel);
      incomingMsgColumnel.appendChild(articleAux);
    } else {
      articleAux.classList.add("is-link");
      columnsContainerEl.appendChild(incomingMsgColumnel);
      columnsContainerEl.appendChild(fullColumnEl);
      incomingMsgColumnel.appendChild(articleAux);
    }

    let divUser = document.createElement("div");
    divUser.classList.add("message-header");

    let pAux = document.createElement("p");

    pAux.innerHTML = user;

    let messageBodyDiv = document.createElement("div");

    messageBodyDiv.classList.add("message-body");

    // let divData = document.createElement("code");
    messageBodyDiv.innerHTML = data;
    divUser.innerHTML = user;
    // divUser.appendChild(pAux);
    // messageBodyDiv.appendChild(divData);
    articleAux.appendChild(divUser);
    articleAux.appendChild(messageBodyDiv);
    chatUI.appendChild(columnsContainerEl);

    let chatContainer = document.getElementById("chatContainer");
    chatContainer.scrollTop = chatContainer.scrollHeight;
  }

  function logOn() {
    logged = true;
    mySession = inputLog.value;
    labelName.innerHTML = inputLog.value;
    btnSend.innerHTML = "Enviar";
  }

  function logOff() {
    logged = false;
    mySession = null;
    labelName.innerHTML = "Nombre";
    btnSend.innerHTML = "Login";
  }
});

document.addEventListener("DOMContentLoaded", () => {
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

  let userslUl = document.querySelectorAll("#usersUl")[0];
  let chatUI = document.querySelectorAll("#chat")[0];
  let ws = new WebSocket("wss://e3obb.sse.codesandbox.io"); // event emmited when connected
  ws.onopen = function() {
    console.log("websocket is connected ..."); // sending a send event to websocket server
  }; // event emmited when receiving message
  ws.onmessage = function(ev) {
    console.log(ev);
    // response.innerHTML = ev.data;

    let data = JSON.parse(ev.data);

    if (data.usr !== undefined) {
      var usersAux = data.usr;

      if (data.chat !== undefined) {
        var chatMsg = data.chat;
        appendMsg(usersAux + " : " + chatMsg);
      }
    }
  };

  ws.onclose = function(evt) {
    appendMsg("Connection close with server");
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
        ws.send(JSON.stringify({ user: mySession, chat: inputLog.value }));
      }
      inputLog.value = "";
    }
  }

  function appendMsg(data) {
    let li = document.createElement("li");
    li.innerHTML = data;
    chatUI.appendChild(li);
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

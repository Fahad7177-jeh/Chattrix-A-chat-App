(function () {
  const app = document.querySelector(".app");
  const socket = io();
  let uname;

  // Join chat
  app.querySelector(".join-screen #join-user").addEventListener("click", function () {
    let username = app.querySelector(".join-screen #username").value.trim();
    if (username.length === 0) return;

    socket.emit("newuser", username);
    uname = username;

    app.querySelector(".join-screen").classList.remove("active");
    app.querySelector(".chat-screen").classList.add("active");
  });

  // Send message
  app.querySelector(".chat-screen #send-message").addEventListener("click", function () {
    let message = app.querySelector(".chat-screen #message-input").value.trim();
    if (message.length === 0) return;

    const timestamp = getCurrentTime();

    renderMessage("my", {
      username: uname,
      text: message,
      time: timestamp,
    });

    socket.emit("chat", {
      username: uname,
      text: message,
      time: timestamp,
    });

    app.querySelector(".chat-screen #message-input").value = "";
  });

  // Exit chat
  app.querySelector(".chat-screen #exit-chat").addEventListener("click", function () {
    socket.emit("exituser", uname);
    window.location.href = window.location.href;
  });

  // Receive message from other users
  socket.on("chat", function (message) {
    renderMessage("other", message);
  });

  // Receive updates (user join/leave or broadcast messages)
  socket.on("update", function (data) {
    if (typeof data === "object" && data.username && data.text) {
      renderMessage("other", data);
    } else {
      renderMessage("update", data);
    }
  });

  // Render message to the chat window
  function renderMessage(type, message) {
    const messageContainer = app.querySelector(".chat-screen .messages");
    const el = document.createElement("div");

    if (type === "my") {
      el.setAttribute("class", "message my-message");
      el.innerHTML = `
        <div>
          <div class="name">You</div>
          <div class="text">${message.text}</div>
          <div class="time">${message.time}</div>
        </div>
      `;
    } else if (type === "other") {
      el.setAttribute("class", "message other-message");
      el.innerHTML = `
        <div>
          <div class="name">${message.username}</div>
          <div class="text">${message.text}</div>
          <div class="time">${message.time}</div>
        </div>
      `;
    } else if (type === "update") {
      el.setAttribute("class", "update");
      el.innerText = message;
    }

    messageContainer.appendChild(el);
    messageContainer.scrollTop = messageContainer.scrollHeight;
  }

  // Utility: Get current time in hh:mm AM/PM format
  function getCurrentTime() {
    const now = new Date();
    return now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  }
})();

const express = require("express");
const path = require("path");
const http = require("http"); // Use HTTP instead of HTTPS

const app = express();
const server = http.createServer(app);
const io = require("socket.io")(server);

// Serve static files from public folder
app.use(express.static(path.join(__dirname, "public")));

// Socket.io handling
io.on("connection", function(socket) {
  socket.on("newuser", function(username) {
    socket.broadcast.emit("update", username + " joined the conversation");
  });

  socket.on("exituser", function(username) {
    socket.broadcast.emit("update", username + " left the conversation");
  });

  socket.on("chat", function(message) {
    socket.broadcast.emit("update", message);
  });
});

// Start the server
server.listen(5000, () => {
  console.log("Server started on http://localhost:5000");
});

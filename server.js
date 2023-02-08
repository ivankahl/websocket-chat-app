const http = require("http");
const express = require("express");
const socket = require("socket.io");

// Create new Express app to implement HTTP endpoints
const app = express();

// Create a new HTTP server that will host the Express app
// and Socket.IO
const server = http.createServer(app);

// Add Socket.IO to the HTTP server.
const io = new socket.Server(server);

app.get("/", function (req, res) {
  res.sendFile(__dirname + "/index.html");
});

io.on("connection", function (socket) {
  console.log("Client connected to socket");

  // Store the username for the current connection
  let username = "Anonymous";

  // Triggered when a client first registers their username
  socket.on(“registerUsername”, function (msg) {
    username = msg.username;
  });

  // Triggered every time a client sends a new message
  socket.on("sendMessage", function ({ message }) {
    console.log(`Received the following message from ${username}: ${message}`);

    // Send the message to all other clients
    socket.broadcast.emit("message", { username, message });
  });
});

const port = parseInt(process.env.CHAT_APP_PORT ?? "3000");
server.listen(port, function () {
  console.log(`Server listening on port ${port}`);
});

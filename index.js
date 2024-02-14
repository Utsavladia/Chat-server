const express = require("express");
const app = express();
const http = require("http");
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
  },
});

const users = {};

app.get("/", (req, res) => {
  res.send("hellow bhaiiii");
});

io.on("connection", (socket) => {
  console.log("a user connected");

  socket.on("name", (name) => {
    users[socket.id] = name;
  });

  socket.on("sendMessage", (message) => {
    const senderName = users[socket.id];
    io.emit("newMessage", { sender: senderName, message });
    console.log(`Message from ${socket.id}: ${message}`);
  });

  socket.on("disconnect", () => {
    console.log(`User disconnected: ${socket.id}`);
  });
});

server.listen(4000, () => {
  console.log("listening on *:4000");
});

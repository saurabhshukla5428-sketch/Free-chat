const express = require("express");
const http = require("http");
const socketIo = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

app.use(express.static("public"));

let users = {};

io.on("connection", (socket) => {

    socket.on("join", (username) => {
        users[socket.id] = username;
        io.emit("userList", users);
    });

    socket.on("sendMessage", (msg) => {
        io.emit("message", {
            user: users[socket.id],
            text: msg
        });
    });

    socket.on("privateMessage", ({toId, msg}) => {
        io.to(toId).emit("privateMessage", {
            from: users[socket.id],
            text: msg
        });
    });

    socket.on("disconnect", () => {
        delete users[socket.id];
        io.emit("userList", users);
    });

});

server.listen(3000, () => {
    console.log("Server running on http://localhost:3000");
});

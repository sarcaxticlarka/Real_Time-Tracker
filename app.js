// const express = require('express');
// const app = express()
// const path = require("path")

// const http = require("http")

// const socketio = require("socket.io")
// const server = http.createServer(app)
// const io = socketio(server)

// app.set("view engine", "ejs");
// app.use(express.static(path.join(__dirname, "public")));

// io.on("connection", function (socket) {
//     socket.on("send-location", function (data) {
//         io.emit("receive-location", { id: socket.id, ...data })
//     })
//     socket.on("disconnect", function () {
//         io.emit("user-disconnected", socket.id)
//     })
// })


// app.get("/", (req, res) => {
//     res.render("index") 
// })

// server.listen(3000);


const express = require('express');
const app = express();
const path = require("path");
const http = require("http");
const socketio = require("socket.io");

try {
    const server = http.createServer(app);
    const io = socketio(server);

    app.set("view engine", "ejs");
    app.use(express.static(path.join(__dirname, "public")));

    io.on("connection", function (socket) {
        console.log("A user connected:", socket.id);

        socket.on("send-location", function (data) {
            io.emit("receive-location", { id: socket.id, ...data });
        });

        socket.on("disconnect", function () {
            io.emit("user-disconnected", socket.id);
            console.log("A user disconnected:", socket.id);
        });
    });

    app.get("/", (req, res) => {
        res.render("index");
    });

    server.listen(3000, () => {
        console.log("Server is listening on port 3000");
    });
} catch (error) {
    console.error("An error occurred:", error);
}

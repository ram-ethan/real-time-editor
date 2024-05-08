const express = require("express");
const app = express();
const http = require('http');
const { Server } = require('socket.io');
const ACTIONS = require("./src/pages/Actions");
const { dirname } = require("path");
const server = http.createServer(app);
const io = new Server(server);
const PORT = process.env.PORT || 5000;
const userSocketMap = {};

app.use(express.static('build'));
const path = require('path');
app.use((req, res, next) => {
    res.sendFile(path.join(__dirname, 'build', 'index.html'));
})

function getAllConnnectedCLients(roomId) {
    return Array.from(io.sockets.adapter.rooms.get(roomId) || []).map((socketId) => {
        return {
            socketId, username: userSocketMap[socketId]
        }
    });
}
io.on('connection', (socket) => {
    console.log('socket connected', socket.id);
    socket.on(ACTIONS.JOIN, ({ roomId, username }) => {
        userSocketMap[socket.id] = username;
        socket.join(roomId);
        const clients = getAllConnnectedCLients(roomId);
        clients.forEach(({ socketId }) => {
            io.to(socketId).emit(ACTIONS.JOINED, {
                clients, username, socketId: socket.id
            });

        });

    });
    socket.on(ACTIONS.CODE_CHANGE, ({ roomId, code }) => {
        socket.in(roomId).emit(ACTIONS.CODE_CHANGE, { code });
    })
    socket.on(ACTIONS.SYNC_CODE, ({ code, socketId }) => {
        io.to(socketId).emit(ACTIONS.CODE_CHANGE, { code });
    })
    socket.on('disconnecting', () => {
        const rooms = [...socket.rooms];
        rooms.forEach((roomId) => {
            socket.in(roomId).emit(ACTIONS.DISCONNECTED, { socketId: socket.id, username: userSocketMap[socket.id] });
        })
    })
    delete userSocketMap[socket.id];
    socket.leave();
});
server.listen(PORT, () => {
    console.log(`Litening on this PORT : ${PORT}`);
})

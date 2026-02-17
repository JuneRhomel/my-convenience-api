"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.initSocket = initSocket;
const socket_io_1 = require("socket.io");
const chat_socket_1 = require("./module/chat/chat.socket");
const auth_middleware_1 = require("./middlewares/auth.middleware");
function initSocket(server) {
    const io = new socket_io_1.Server(server, {
        cors: {
            origin: "http://localhost:3000",
        },
    });
    io.use(auth_middleware_1.authSocketMiddleware);
    io.on("connection", (socket) => {
        console.log("User connected:", socket.id);
        (0, chat_socket_1.registerChatHandlers)(io, socket);
        socket.on("disconnect", () => {
            console.log("User disconnected:", socket.id);
        });
    });
}

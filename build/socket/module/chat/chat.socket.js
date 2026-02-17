"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerChatHandlers = registerChatHandlers;
const chat_service_1 = require("./chat.service");
function registerChatHandlers(io, socket) {
    socket.on("chat:send", async (data) => {
        const message = await (0, chat_service_1.chatSend)(data);
        io.emit("chat:receive", message);
    });
}

import { Server, Socket } from "socket.io";
import http from "http";
import { registerChatHandlers } from "./module/chat/chat.socket";
import { authSocketMiddleware } from "./middlewares/auth.middleware";

export function initSocket(server: http.Server) {
    const io = new Server(server, {
        cors: {
            origin: "http://localhost:3000",
        },
    });

    io.use(authSocketMiddleware);

    io.on("connection", (socket) => {
        console.log("User connected:", socket.id);

        registerChatHandlers(io, socket)

        socket.on("disconnect", () => {
            console.log("User disconnected:", socket.id);
        });
    });
}

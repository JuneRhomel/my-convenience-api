import { Server, Socket } from "socket.io";
import { chatSend } from "./chat.service";

export function registerChatHandlers(io: Server, socket: Socket) {

    socket.on("chat:send", async (data) => {
        const message = await chatSend(data)

        io.emit("chat:receive", message);
    });

}

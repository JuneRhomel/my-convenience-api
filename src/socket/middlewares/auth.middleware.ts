import { Socket } from "socket.io";
import jwt from "jsonwebtoken";
import config from "../../config/config";


export function authSocketMiddleware(socket: Socket, next: any) {
    try {
        const token = socket.handshake.auth.token;
        
        if (!token) {
            return next(new Error("Unauthorized"));
        }
        
        const decoded = jwt.verify(token, config.jwtAccessSecret);
        socket.data.user = decoded;
        
        next();
    } catch (e) {
        console.log(e)
        next(new Error("Unauthorized"));
    }
}

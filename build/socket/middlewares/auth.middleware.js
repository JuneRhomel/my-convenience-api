"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authSocketMiddleware = authSocketMiddleware;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const config_1 = __importDefault(require("../../config/config"));
function authSocketMiddleware(socket, next) {
    try {
        const token = socket.handshake.auth.token;
        if (!token) {
            return next(new Error("Unauthorized"));
        }
        const decoded = jsonwebtoken_1.default.verify(token, config_1.default.jwtAccessSecret);
        socket.data.user = decoded;
        next();
    }
    catch (e) {
        console.log(e);
        next(new Error("Unauthorized"));
    }
}

"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const config_1 = __importDefault(require("../../../config/config"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
function validateBearerToken(bearerToken) {
    if (!bearerToken.startsWith("Bearer ")) {
        return "Authorization header must start with 'Bearer '";
    }
    const token = bearerToken.split(" ")[1];
    if (!token) {
        return "Authorization header must contain a token";
    }
    const decoded = jsonwebtoken_1.default.verify(token, config_1.default.jwtAccessSecret);
    if (decoded.sub === undefined) {
        return "Invalid bearer token";
    }
    return { userId: parseInt(decoded.sub, 10), name: decoded.name };
}
exports.default = validateBearerToken;

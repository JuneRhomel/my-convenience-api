"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const validateBearerToken_1 = __importDefault(require("./helper/validateBearerToken"));
/**
 * Middleware that validates Bearer token and sets req.userId.
 * Responds with 401 if Authorization header is missing or token is invalid.
 */
function requireAuth(req, res, next) {
    const authHeader = req.headers.authorization;
    if (typeof authHeader !== "string" || !authHeader) {
        throw new Error("Authorization header is required");
    }
    const result = (0, validateBearerToken_1.default)(authHeader);
    if (typeof result === "string") {
        throw new Error(result);
    }
    const { userId, name } = result;
    req.userId = userId;
    req.name = name;
    next();
}
exports.default = requireAuth;

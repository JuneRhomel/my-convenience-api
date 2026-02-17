"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const config = {
    port: Number(process.env.PORT) || 3000,
    nodeEnv: process.env.NODE_ENV || "development",
    dbHost: process.env.DB_HOST || "",
    dbName: process.env.DB_NAME || "",
    dbPass: process.env.DB_PASS || "",
    dbUser: process.env.DB_USER || "",
    jwtAccessSecret: process.env.JWT_ACCESS_SECRET || "",
    jwtRefreshSecret: process.env.JWT_REFRESH_SECRET || "",
    jwtAccessExpiry: process.env.JWT_ACCESS_EXPIRY || "15m",
    jwtRefreshExpiry: process.env.JWT_REFRESH_EXPIRY || "7d"
};
exports.default = config;

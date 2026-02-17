"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const app_1 = __importDefault(require("./app"));
const config_1 = __importDefault(require("./config/config"));
const database_1 = __importDefault(require("./config/database"));
const http = require("http");
const server = http.createServer(app_1.default);
(async () => {
    try {
        await database_1.default.authenticate();
        console.log("Database connected");
    }
    catch (err) {
        console.error("DB connection failed", err);
        process.exit(1);
    }
})();
server.listen(config_1.default.port, () => {
    console.log(`Server running on port ${config_1.default.port}`);
});

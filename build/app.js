"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_routes_1 = __importDefault(require("./routes/auth.routes"));
const receipt_routes_1 = __importDefault(require("./routes/receipt.routes"));
const error_handler_middlewares_1 = require("./middlewares/error_handler.middlewares");
const database_1 = __importDefault(require("./config/database"));
const cors_1 = __importDefault(require("cors"));
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use((0, cors_1.default)({
    origin: "*", // allow all origins (for development)
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
}));
app.use('/api/auth', auth_routes_1.default);
app.use('/api/receipts', receipt_routes_1.default);
app.use(error_handler_middlewares_1.errorHandler);
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
exports.default = app;

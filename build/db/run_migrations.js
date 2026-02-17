"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const database_1 = __importDefault(require("../config/database"));
const createUsers = __importStar(require("./migrations/20250131100000_create_users"));
const createRefreshTokens = __importStar(require("./migrations/20250131110000_create_refresh_tokens"));
const createReceipts = __importStar(require("./migrations/20250216100000_create_receipts"));
async function runMigrations() {
    const queryInterface = database_1.default.getQueryInterface();
    try {
        await createUsers.up(queryInterface);
        console.log("Migration 20250131100000_create_users completed.");
        await createRefreshTokens.up(queryInterface);
        console.log("Migration 20250201150000_create_meter_readings completed.");
        await createReceipts.up(queryInterface);
        console.log("Migration 20250216100000_create_receipts completed.");
    }
    catch (err) {
        console.error("Migration failed:", err);
        process.exit(1);
    }
    finally {
        await database_1.default.close();
    }
}
runMigrations();

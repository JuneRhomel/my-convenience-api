"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const database_1 = __importDefault(require("../config/database"));
/**
 * RefreshToken model for storing refresh tokens (opaque tokens, revocable).
 */
class RefreshToken extends sequelize_1.Model {
}
const TOKEN_LENGTH = 80;
RefreshToken.init({
    id: {
        type: sequelize_1.DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    userId: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
        references: { model: "users", key: "id" },
        onDelete: "CASCADE"
    },
    token: {
        type: sequelize_1.DataTypes.STRING(TOKEN_LENGTH),
        allowNull: false,
        unique: true
    },
    expiresAt: {
        type: sequelize_1.DataTypes.DATE,
        allowNull: false
    }
}, {
    sequelize: database_1.default,
    tableName: "refresh_tokens",
    timestamps: true,
    updatedAt: false
});
exports.default = RefreshToken;

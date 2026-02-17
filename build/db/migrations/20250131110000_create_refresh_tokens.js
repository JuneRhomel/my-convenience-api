"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.up = up;
exports.down = down;
const sequelize_1 = require("sequelize");
const TABLE_NAME = "refresh_tokens";
const TOKEN_LENGTH = 80;
/**
 * Creates the refresh_tokens table for storing refresh tokens.
 */
async function up(queryInterface) {
    await queryInterface.createTable(TABLE_NAME, {
        id: {
            type: sequelize_1.DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
            allowNull: false
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
        },
        createdAt: {
            type: sequelize_1.DataTypes.DATE,
            allowNull: false
        }
    });
}
/**
 * Drops the refresh_tokens table.
 */
async function down(queryInterface) {
    await queryInterface.dropTable(TABLE_NAME);
}

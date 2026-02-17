"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.up = up;
exports.down = down;
const sequelize_1 = require("sequelize");
const TABLE_NAME = "users";
const PHONE_NUMBER_LENGTH = 20;
/**
 * Creates the users table (email/password and Google auth).
 */
async function up(queryInterface) {
    await queryInterface.createTable(TABLE_NAME, {
        id: {
            type: sequelize_1.DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
            allowNull: false
        },
        name: {
            type: sequelize_1.DataTypes.STRING,
            allowNull: false
        },
        lastName: {
            type: sequelize_1.DataTypes.STRING,
            allowNull: false
        },
        email: {
            type: sequelize_1.DataTypes.STRING,
            allowNull: false,
            unique: true
        },
        phoneNumber: {
            type: sequelize_1.DataTypes.STRING(PHONE_NUMBER_LENGTH),
            allowNull: true
        },
        password: {
            type: sequelize_1.DataTypes.STRING,
            allowNull: true
        },
        googleId: {
            type: sequelize_1.DataTypes.STRING,
            allowNull: true,
            unique: true
        },
        createdAt: {
            type: sequelize_1.DataTypes.DATE,
            allowNull: false
        },
        updatedAt: {
            type: sequelize_1.DataTypes.DATE,
            allowNull: false
        }
    });
}
/**
 * Drops the users table.
 */
async function down(queryInterface) {
    await queryInterface.dropTable(TABLE_NAME);
}

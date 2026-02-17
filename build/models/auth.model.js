"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const database_1 = __importDefault(require("../config/database"));
/**
 * User model for email/password and Google authentication.
 */
class User extends sequelize_1.Model {
}
const PHONE_NUMBER_LENGTH = 20;
User.init({
    id: {
        type: sequelize_1.DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
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
        unique: true,
        validate: { isEmail: true }
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
    }
}, {
    sequelize: database_1.default,
    tableName: "users",
    timestamps: true
});
exports.default = User;

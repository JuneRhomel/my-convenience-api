"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const database_1 = __importDefault(require("../config/database"));
class Receipt extends sequelize_1.Model {
}
Receipt.init({
    id: {
        type: sequelize_1.DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    createdBy: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
        references: { model: "users", key: "id" }
    },
    date: {
        type: sequelize_1.DataTypes.DATEONLY,
        allowNull: false
    },
    typeExpenses: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false
    },
    companyName: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false
    },
    address: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false
    },
    tinNumber: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false
    },
    image: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: true
    },
    gross: {
        type: sequelize_1.DataTypes.DECIMAL(12, 2),
        allowNull: false
    },
    netOfVat: {
        type: sequelize_1.DataTypes.DECIMAL(12, 2),
        allowNull: false
    },
    inputTax: {
        type: sequelize_1.DataTypes.DECIMAL(12, 2),
        allowNull: false
    },
    wtax: {
        type: sequelize_1.DataTypes.DECIMAL(12, 2),
        allowNull: false
    },
    payment: {
        type: sequelize_1.DataTypes.DECIMAL(12, 2),
        allowNull: false
    }
}, {
    sequelize: database_1.default,
    tableName: "receipts",
    timestamps: true
});
exports.default = Receipt;

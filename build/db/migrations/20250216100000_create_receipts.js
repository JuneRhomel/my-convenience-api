"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.up = up;
exports.down = down;
const sequelize_1 = require("sequelize");
const TABLE_NAME = "receipts";
async function up(queryInterface) {
    await queryInterface.createTable(TABLE_NAME, {
        id: {
            type: sequelize_1.DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
            allowNull: false
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
        },
        createdBy: {
            type: sequelize_1.DataTypes.INTEGER,
            allowNull: false,
            references: { model: "users", key: "id" }
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
async function down(queryInterface) {
    await queryInterface.dropTable(TABLE_NAME);
}

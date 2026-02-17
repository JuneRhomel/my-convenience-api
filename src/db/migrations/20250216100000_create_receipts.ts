import { QueryInterface, DataTypes } from "sequelize";

const TABLE_NAME = "receipts";

export async function up(queryInterface: QueryInterface): Promise<void> {
    await queryInterface.createTable(TABLE_NAME, {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
            allowNull: false
        },
        date: {
            type: DataTypes.DATEONLY,
            allowNull: false
        },
        typeExpenses: {
            type: DataTypes.STRING,
            allowNull: false
        },
        companyName: {
            type: DataTypes.STRING,
            allowNull: false
        },
        address: {
            type: DataTypes.STRING,
            allowNull: false
        },
        tinNumber: {
            type: DataTypes.STRING,
            allowNull: false
        },
        image: {
            type: DataTypes.STRING,
            allowNull: true
        },
        gross: {
            type: DataTypes.DECIMAL(12, 2),
            allowNull: false
        },
        netOfVat: {
            type: DataTypes.DECIMAL(12, 2),
            allowNull: false
        },
        inputTax: {
            type: DataTypes.DECIMAL(12, 2),
            allowNull: false
        },
        wtax: {
            type: DataTypes.DECIMAL(12, 2),
            allowNull: false
        },
        payment: {
            type: DataTypes.DECIMAL(12, 2),
            allowNull: false
        },
        createdBy: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: { model: "users", key: "id" }
        },
        createdAt: {
            type: DataTypes.DATE,
            allowNull: false
        },
        updatedAt: {
            type: DataTypes.DATE,
            allowNull: false
        }
    });
}

export async function down(queryInterface: QueryInterface): Promise<void> {
    await queryInterface.dropTable(TABLE_NAME);
}

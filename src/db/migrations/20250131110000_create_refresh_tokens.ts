import { QueryInterface, DataTypes } from "sequelize";

const TABLE_NAME = "refresh_tokens";
const TOKEN_LENGTH = 80;

/**
 * Creates the refresh_tokens table for storing refresh tokens.
 */
export async function up(queryInterface: QueryInterface): Promise<void> {
    await queryInterface.createTable(TABLE_NAME, {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
            allowNull: false
        },
        userId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: { model: "users", key: "id" },
            onDelete: "CASCADE"
        },
        token: {
            type: DataTypes.STRING(TOKEN_LENGTH),
            allowNull: false,
            unique: true
        },
        expiresAt: {
            type: DataTypes.DATE,
            allowNull: false
        },
        createdAt: {
            type: DataTypes.DATE,
            allowNull: false
        }
    });
}

/**
 * Drops the refresh_tokens table.
 */
export async function down(queryInterface: QueryInterface): Promise<void> {
    await queryInterface.dropTable(TABLE_NAME);
}

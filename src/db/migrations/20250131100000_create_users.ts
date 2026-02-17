import { QueryInterface, DataTypes } from "sequelize";

const TABLE_NAME = "users";
const PHONE_NUMBER_LENGTH = 20;

/**
 * Creates the users table (email/password and Google auth).
 */
export async function up(queryInterface: QueryInterface): Promise<void> {
    await queryInterface.createTable(TABLE_NAME, {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
            allowNull: false
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false
        },
        lastName: {
            type: DataTypes.STRING,
            allowNull: false
        },
        email: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true
        },
        phoneNumber: {
            type: DataTypes.STRING(PHONE_NUMBER_LENGTH),
            allowNull: true
        },
        password: {
            type: DataTypes.STRING,
            allowNull: true
        },
        googleId: {
            type: DataTypes.STRING,
            allowNull: true,
            unique: true
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

/**
 * Drops the users table.
 */
export async function down(queryInterface: QueryInterface): Promise<void> {
    await queryInterface.dropTable(TABLE_NAME);
}

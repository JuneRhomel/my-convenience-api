import { DataTypes, Model, Optional } from "sequelize";
import sequelize from "../config/database";

/** User entity attributes. */
export interface UserAttributes {
    id: number;
    name: string;
    lastName: string;
    email: string;
    phoneNumber: string | null;
    password: string | null;
    googleId: string | null;
    createdAt?: Date;
    updatedAt?: Date;
}

/** Attributes required to create a user (id and timestamps optional). */
export type UserCreationAttributes = Optional<
    UserAttributes,
    "id" | "password" | "googleId" | "createdAt" | "updatedAt"
>;

/**
 * User model for email/password and Google authentication.
 */
class User
    extends Model<UserAttributes, UserCreationAttributes>
    implements UserAttributes {
    declare id: number;
    declare name: string;
    declare lastName: string;
    declare email: string;
    declare phoneNumber: string | null;
    declare password: string | null;
    declare googleId: string | null;
    declare createdAt: Date;
    declare updatedAt: Date;
}

const PHONE_NUMBER_LENGTH = 20;

User.init(
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
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
            unique: true,
            validate: { isEmail: true }
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
        }
    },
    {
        sequelize,
        tableName: "users",
        timestamps: true
    }
);

export default User;

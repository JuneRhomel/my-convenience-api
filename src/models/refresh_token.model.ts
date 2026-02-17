import { DataTypes, Model, Optional } from "sequelize";
import sequelize from "../config/database";

/** RefreshToken entity attributes. */
export interface RefreshTokenAttributes {
    id: number;
    userId: number;
    token: string;
    expiresAt: Date;
    createdAt?: Date;
}

/** Attributes required to create a refresh token (id optional). */
export type RefreshTokenCreationAttributes = Optional<
    RefreshTokenAttributes,
    "id" | "createdAt"
>;

/**
 * RefreshToken model for storing refresh tokens (opaque tokens, revocable).
 */
class RefreshToken
    extends Model<RefreshTokenAttributes, RefreshTokenCreationAttributes>
    implements RefreshTokenAttributes {
    declare id: number;
    declare userId: number;
    declare token: string;
    declare expiresAt: Date;
    declare createdAt: Date;
}

const TOKEN_LENGTH = 80;

RefreshToken.init(
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
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
        }
    },
    {
        sequelize,
        tableName: "refresh_tokens",
        timestamps: true,
        updatedAt: false
    }
);

export default RefreshToken;

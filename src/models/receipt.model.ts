import { DataTypes, Model, Optional } from "sequelize";
import sequelize from "../config/database";

export interface ReceiptAttributes {
    id: number;
    createdBy: number;
    date: string;
    typeExpenses: string;
    companyName: string;
    address: string;
    tinNumber: string;
    image: string | null;
    gross: number;
    netOfVat: number;
    inputTax: number;
    wtax: number;
    payment: number;
    createdAt?: Date;
    updatedAt?: Date;
}

export type ReceiptCreationAttributes = Optional<
    ReceiptAttributes,
    "id" | "createdAt" | "updatedAt"
>;

class Receipt
    extends Model<ReceiptAttributes, ReceiptCreationAttributes>
    implements ReceiptAttributes {
    declare id: number;
    declare createdBy: number;
    declare date: string;
    declare typeExpenses: string;
    declare companyName: string;
    declare address: string;
    declare tinNumber: string;
    declare image: string | null;
    declare gross: number;
    declare netOfVat: number;
    declare inputTax: number;
    declare wtax: number;
    declare payment: number;
    declare createdAt: Date;
    declare updatedAt: Date;
}

Receipt.init(
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        createdBy: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: { model: "users", key: "id" }
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
        }
    },
    {
        sequelize,
        tableName: "receipts",
        timestamps: true
    }
);

export default Receipt;

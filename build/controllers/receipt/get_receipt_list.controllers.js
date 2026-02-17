"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = getReceiptList;
const sequelize_1 = require("sequelize");
const receipt_model_1 = __importDefault(require("../../models/receipt.model"));
function formatDateOnly(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
}
function getCutoffRange(dateString) {
    const baseDate = new Date(dateString);
    if (Number.isNaN(baseDate.getTime())) {
        throw new Error("Invalid date parameter");
    }
    const year = baseDate.getFullYear();
    const monthIndex = baseDate.getMonth();
    const dayOfMonth = baseDate.getDate();
    let periodStart;
    let periodEnd;
    if (dayOfMonth <= 20) {
        periodEnd = new Date(year, monthIndex, 20);
        const previousMonth = new Date(year, monthIndex, 1);
        previousMonth.setMonth(previousMonth.getMonth() - 1);
        periodStart = new Date(previousMonth.getFullYear(), previousMonth.getMonth(), 21);
    }
    else {
        periodStart = new Date(year, monthIndex, 21);
        const nextMonth = new Date(year, monthIndex, 1);
        nextMonth.setMonth(nextMonth.getMonth() + 1);
        periodEnd = new Date(nextMonth.getFullYear(), nextMonth.getMonth(), 20);
    }
    return {
        start: formatDateOnly(periodStart),
        end: formatDateOnly(periodEnd),
    };
}
async function getReceiptList(req, res, next) {
    try {
        const authReq = req;
        const { month, year } = req.query;
        const where = {
            createdBy: authReq.userId,
        };
        if (typeof month === "string" &&
            typeof year === "string" &&
            month.trim() !== "" &&
            year.trim() !== "") {
            const monthNumber = Number(month);
            const yearNumber = Number(year);
            if (!Number.isInteger(monthNumber) ||
                monthNumber < 1 ||
                monthNumber > 12) {
                throw new Error("Invalid month parameter");
            }
            if (!Number.isInteger(yearNumber)) {
                throw new Error("Invalid year parameter");
            }
            const paddedMonth = String(monthNumber).padStart(2, "0");
            const dateString = `${yearNumber}-${paddedMonth}-01`;
            const { start, end } = getCutoffRange(dateString);
            where.date = {
                [sequelize_1.Op.between]: [start, end],
            };
        }
        const receipts = await receipt_model_1.default.findAll({
            where,
            order: [
                ["date", "DESC"],
                ["createdAt", "DESC"],
            ],
        });
        res.status(200).json(receipts);
    }
    catch (err) {
        next(err);
    }
}

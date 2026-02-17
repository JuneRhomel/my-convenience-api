"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = generateReceiptExcel;
const exceljs_1 = __importDefault(require("exceljs"));
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
function buildWhereCondition(authReq, month, year) {
    const where = {
        createdBy: authReq.userId,
    };
    if (typeof month === "string" && typeof year === "string" && month.trim() !== "" && year.trim() !== "") {
        const monthNumber = Number(month);
        const yearNumber = Number(year);
        if (!Number.isInteger(monthNumber) || monthNumber < 1 || monthNumber > 12) {
            throw new Error("Invalid month parameter");
        }
        if (!Number.isInteger(yearNumber)) {
            throw new Error("Invalid year parameter");
        }
        const paddedMonth = String(monthNumber).padStart(2, "0");
        const dateString = `${yearNumber}-${paddedMonth}-01`;
        const cutoffRange = getCutoffRange(dateString);
        where.date = {
            [sequelize_1.Op.between]: [cutoffRange.start, cutoffRange.end],
        };
    }
    return where;
}
function getMonthName(monthNumber) {
    return new Date(2026, monthNumber - 1).toLocaleString("en-US", {
        month: "long",
    });
}
async function buildWorkbook(receipts, month, year) {
    const workbook = new exceljs_1.default.Workbook();
    const worksheet = workbook.addWorksheet("Receipts");
    // Keep first two rows empty
    worksheet.addRow([]);
    worksheet.addRow([]);
    // Optional: Employee name in row 2, column A
    worksheet.getCell(`A2`).value = "Name of Employee";
    worksheet.getCell(`A2`).font = { bold: true };
    worksheet.getCell(`B1`).value = `Summary of Receipts for ${getMonthName(Number(month))} 20 ${year}`;
    worksheet.getCell(`B1`).alignment = { horizontal: "center" };
    worksheet.getCell(`B1`).font = { bold: true };
    // Add header row at row 3
    const headerRow = worksheet.addRow([
        null,
        "Date",
        "Type",
        "Company",
        "Address",
        "TIN",
        "Gross",
        "Net of VAT",
        "Input Tax",
        "WTax",
        "Payment",
    ]);
    // Make headers bold
    headerRow.font = { bold: true };
    // Set column widths
    worksheet.columns = [
        { key: "empty", width: 25 },
        { key: "date", width: 40 },
        { key: "typeExpenses", width: 18 },
        { key: "companyName", width: 30 },
        { key: "address", width: 40 },
        { key: "tinNumber", width: 18 },
        { key: "gross", width: 12 },
        { key: "netOfVat", width: 14 },
        { key: "inputTax", width: 14 },
        { key: "wtax", width: 12 },
        { key: "payment", width: 14 },
    ];
    // Add data starting from row 4
    receipts.forEach((receipt) => {
        worksheet.addRow({
            date: new Date(receipt.date),
            typeExpenses: receipt.typeExpenses,
            companyName: receipt.companyName,
            address: receipt.address,
            tinNumber: receipt.tinNumber,
            gross: Number(receipt.gross),
            netOfVat: Number(receipt.netOfVat),
            inputTax: Number(receipt.inputTax),
            wtax: Number(receipt.wtax),
            payment: Number(receipt.payment),
        });
    });
    worksheet.getColumn("date").numFmt = "mm/dd/yyyy";
    const currencyColumns = ["gross", "netOfVat", "inputTax", "wtax", "payment"];
    currencyColumns.forEach((key) => {
        worksheet.getColumn(key).numFmt = "#,##0.00"; // two decimals, no currency, no red
    });
    const columnCenter = ["date", "typeExpenses", "companyName", "address", "tinNumber"];
    columnCenter.forEach((key) => {
        worksheet.getColumn(key).alignment = { horizontal: "center" };
    });
    const columnRight = ["gross", "netOfVat", "inputTax", "wtax", "payment"];
    columnRight.forEach((key) => {
        worksheet.getColumn(key).alignment = { horizontal: "right" };
    });
    // Add total payment row at the end
    const totalPayment = receipts.reduce((sum, item) => sum + Number(item.payment), 0);
    const totalRowIndex = receipts.length + 4; // +4 because data starts at row 4
    worksheet.getCell(`A3`).value = "JUNE RHOMEL MANDIGMA";
    worksheet.getCell(`A3`).style.font = { bold: false };
    const totalLabelCell = worksheet.getCell(`I${totalRowIndex + 2}`);
    totalLabelCell.value = "TOTAL";
    const totalValueCell = worksheet.getCell(`K${totalRowIndex + 2}`);
    totalValueCell.value = totalPayment;
    totalLabelCell.font = { bold: true };
    totalValueCell.font = { bold: true };
    totalValueCell.numFmt = "#,##0.00";
    // Add black border to all used cells
    const lastRow = totalRowIndex + 2;
    const lastCol = 11; // column K
    for (let row = 1; row <= lastRow; row++) {
        for (let col = 1; col <= lastCol; col++) {
            const cell = worksheet.getRow(row).getCell(col);
            cell.border = {
                top: { style: "thin", color: { argb: "FF000000" } },
                left: { style: "thin", color: { argb: "FF000000" } },
                bottom: { style: "thin", color: { argb: "FF000000" } },
                right: { style: "thin", color: { argb: "FF000000" } },
            };
        }
    }
    const row = worksheet.getRow(lastRow + 1);
    for (let col = 1; col <= 11; col++) {
        const cell = row.getCell(col);
        cell.fill = {
            type: "pattern",
            pattern: "solid",
            fgColor: { argb: "FF666666" }, // Dark gray
        };
        cell.font = {
            color: { argb: "FFFFFFFF" }, // White text
            bold: true,
        };
    }
    return workbook;
}
async function generateReceiptExcel(req, res, next) {
    try {
        const authReq = req;
        const { month, year } = req.query;
        const where = buildWhereCondition(authReq, month, year);
        const receipts = await receipt_model_1.default.findAll({
            where,
            order: [
                ["date", "ASC"],
                ["createdAt", "ASC"],
            ],
        });
        const filenameMonth = typeof month === "string" && month.trim() !== "" ? month : "all";
        const filenameYear = typeof year === "string" && year.trim() !== "" ? year : "all";
        const workbook = await buildWorkbook(receipts, month, year);
        const safeName = authReq.name?.replace(/\s+/g, "_") ?? "receipts";
        const filename = `${safeName}_${filenameYear}_${filenameMonth}.xlsx`;
        res.setHeader("Content-Type", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
        res.setHeader("Content-Disposition", `attachment; filename = "${filename}"`);
        await workbook.xlsx.write(res);
        res.end();
    }
    catch (err) {
        next(err);
    }
}

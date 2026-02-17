import { Request, Response, NextFunction } from "express";
import ExcelJS from "exceljs";
import { Op, WhereOptions } from "sequelize";
import Receipt, { ReceiptAttributes } from "../../models/receipt.model";
import { AuthenticatedRequest } from "../../middlewares/require_auth.middlewares";

interface CutoffRange {
    start: string;
    end: string;
}

function formatDateOnly(date: Date): string {
    const year: number = date.getFullYear();
    const month: string = String(date.getMonth() + 1).padStart(2, "0");
    const day: string = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
}

function getCutoffRange(dateString: string): CutoffRange {
    const baseDate: Date = new Date(dateString);
    if (Number.isNaN(baseDate.getTime())) {
        throw new Error("Invalid date parameter");
    }
    const year: number = baseDate.getFullYear();
    const monthIndex: number = baseDate.getMonth();
    const dayOfMonth: number = baseDate.getDate();
    let periodStart: Date;
    let periodEnd: Date;
    if (dayOfMonth <= 20) {
        periodEnd = new Date(year, monthIndex, 20);
        const previousMonth: Date = new Date(year, monthIndex, 1);
        previousMonth.setMonth(previousMonth.getMonth() - 1);
        periodStart = new Date(previousMonth.getFullYear(), previousMonth.getMonth(), 21);
    } else {
        periodStart = new Date(year, monthIndex, 21);
        const nextMonth: Date = new Date(year, monthIndex, 1);
        nextMonth.setMonth(nextMonth.getMonth() + 1);
        periodEnd = new Date(nextMonth.getFullYear(), nextMonth.getMonth(), 20);
    }
    return {
        start: formatDateOnly(periodStart),
        end: formatDateOnly(periodEnd),
    };
}

function buildWhereCondition(authReq: AuthenticatedRequest, month?: string, year?: string): WhereOptions<ReceiptAttributes> {
    const where: Record<string, unknown> = {
        createdBy: authReq.userId,
    };
    if (typeof month === "string" && typeof year === "string" && month.trim() !== "" && year.trim() !== "") {
        const monthNumber: number = Number(month);
        const yearNumber: number = Number(year);
        if (!Number.isInteger(monthNumber) || monthNumber < 1 || monthNumber > 12) {
            throw new Error("Invalid month parameter");
        }
        if (!Number.isInteger(yearNumber)) {
            throw new Error("Invalid year parameter");
        }
        const paddedMonth: string = String(monthNumber).padStart(2, "0");
        const dateString: string = `${yearNumber}-${paddedMonth}-01`;
        const cutoffRange: CutoffRange = getCutoffRange(dateString);
        where.date = {
            [Op.between]: [cutoffRange.start, cutoffRange.end],
        };
    }
    return where as WhereOptions<ReceiptAttributes>;
}

function getMonthName(monthNumber: number): string {
    return new Date(2026, monthNumber - 1).toLocaleString("en-US", {
        month: "long",
    });
}



async function buildWorkbook(receipts: Receipt[], month: string, year: string): Promise<ExcelJS.Workbook> {
    const workbook: ExcelJS.Workbook = new ExcelJS.Workbook();
    const worksheet: ExcelJS.Worksheet = workbook.addWorksheet("Receipts");

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
    receipts.forEach((receipt: Receipt) => {
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
    const totalPayment: number = receipts.reduce(
        (sum: number, item: Receipt) => sum + Number(item.payment),
        0
    );
    const totalRowIndex: number = receipts.length + 4; // +4 because data starts at row 4

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


export default async function generateReceiptExcel(
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> {
    try {
        const authReq: AuthenticatedRequest = req as AuthenticatedRequest;
        const { month, year } = req.query as { month: string; year: string };
        const where: WhereOptions<ReceiptAttributes> = buildWhereCondition(authReq, month, year);
        const receipts: Receipt[] = await Receipt.findAll({
            where,
            order: [
                ["date", "ASC"],
                ["createdAt", "ASC"],
            ],
        });
        const filenameMonth: string = typeof month === "string" && month.trim() !== "" ? month : "all";
        const filenameYear: string = typeof year === "string" && year.trim() !== "" ? year : "all";
        const workbook: ExcelJS.Workbook = await buildWorkbook(receipts, month, year);
        const safeName: string = authReq.name?.replace(/\s+/g, "_") ?? "receipts";
        const filename: string = `${safeName}_${filenameYear}_${filenameMonth}.xlsx`;
        res.setHeader(
            "Content-Type",
            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
        );
        res.setHeader(
            "Content-Disposition",
            `attachment; filename = "${filename}"`
        );
        await workbook.xlsx.write(res);
        res.end();
    } catch (err) {
        next(err);
    }
}


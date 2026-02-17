import { Request, Response, NextFunction } from "express";
import { Op } from "sequelize";
import Receipt from "../../models/receipt.model";
import { AuthenticatedRequest } from "../../middlewares/require_auth.middlewares";

function formatDateOnly(date: Date): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
}

function getCutoffRange(dateString: string): { start: string; end: string } {
    const baseDate = new Date(dateString);
    if (Number.isNaN(baseDate.getTime())) {
        throw new Error("Invalid date parameter");
    }

    const year = baseDate.getFullYear();
    const monthIndex = baseDate.getMonth();
    const dayOfMonth = baseDate.getDate();

    let periodStart: Date;
    let periodEnd: Date;

    if (dayOfMonth <= 20) {
        periodEnd = new Date(year, monthIndex, 20);
        const previousMonth = new Date(year, monthIndex, 1);
        previousMonth.setMonth(previousMonth.getMonth() - 1);
        periodStart = new Date(previousMonth.getFullYear(), previousMonth.getMonth(), 21);
    } else {
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

export default async function getReceiptList(
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> {
    try {
        const authReq = req as AuthenticatedRequest;
        const { month, year } = req.query as { month?: string; year?: string };

        const where: Record<string, unknown> = {
            createdBy: authReq.userId,
        };

        if (
            typeof month === "string" &&
            typeof year === "string" &&
            month.trim() !== "" &&
            year.trim() !== ""
        ) {
            const monthNumber = Number(month);
            const yearNumber = Number(year);

            if (
                !Number.isInteger(monthNumber) ||
                monthNumber < 1 ||
                monthNumber > 12
            ) {
                throw new Error("Invalid month parameter");
            }
            if (!Number.isInteger(yearNumber)) {
                throw new Error("Invalid year parameter");
            }

            const paddedMonth = String(monthNumber).padStart(2, "0");
            const dateString = `${yearNumber}-${paddedMonth}-01`;
            const { start, end } = getCutoffRange(dateString);
            where.date = {
                [Op.between]: [start, end],
            };
        }

        const receipts = await Receipt.findAll({
            where,
            order: [
                ["date", "DESC"],
                ["createdAt", "DESC"],
            ],
        });

        res.status(200).json(receipts);
    } catch (err) {
        next(err);
    }
}

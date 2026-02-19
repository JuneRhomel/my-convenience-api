import { Request, Response, NextFunction } from "express";
import Receipt from "../../models/receipt.model";
import { EditReceiptRequestBody } from "../../types/receipt.types";
import validateReceiptBody from "./helper/validateReceiptBody";
import { AuthenticatedRequest } from "../../middlewares/require_auth.middlewares";
import { createFolder } from "../../services/google_drive.service";

function roundTwo(value: number): number {
    return Math.round(value * 100) / 100;
}

export default async function editReceipt(
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> {
    try {
        const receiptId = Number(req.params.id);
        if (Number.isNaN(receiptId) || receiptId < 1) {
            res.status(400).json({ message: "Invalid receipt id" });
            return;
        }
        const validationError = validateReceiptBody(req.body);
        if (validationError !== null) {
            res.status(400).json({ message: validationError });
            return;
        }
        const receipt = await Receipt.findByPk(receiptId);
        if (!receipt) {
            res.status(404).json({ message: "Receipt not found" });
            return;
        }
        const authReq = req as AuthenticatedRequest;
        if (receipt.createdBy !== authReq.userId) {
            res.status(403).json({ message: "Forbidden" });
            return;
        }
        const {
            date,
            typeExpenses,
            companyName,
            address,
            tinNumber,
            gross: grossRaw,
        } = req.body as EditReceiptRequestBody;
        const gross = Number(grossRaw);
        const netOfVat = roundTwo(gross / 1.12);
        const inputTax = roundTwo(gross - netOfVat);
        const wtax = 0;
        const payment = roundTwo(gross - wtax);
        const parsedDate = new Date(date);
        const day = parsedDate.getDate();
        const targetDate =
            day >= 20
                ? new Date(parsedDate.getFullYear(), parsedDate.getMonth() + 1, 20)
                : new Date(parsedDate.getFullYear(), parsedDate.getMonth(), 20);
        const monthShort = targetDate.toLocaleString("en-US", {
            month: "short",
        });
        const year = targetDate.getFullYear();
        const folderName = `${monthShort} 20 ${year}`;
        let imageLink: string | null = receipt.image;
        if (req.file) {
            const file = req.file;
            imageLink = await createFolder({
                folderName,
                file,
            });
        }
        await receipt.update({
            date: date.trim(),
            typeExpenses: typeExpenses.trim(),
            companyName: companyName.trim(),
            address: address.trim(),
            tinNumber: tinNumber.trim(),
            image: imageLink,
            gross,
            netOfVat,
            inputTax,
            wtax,
            payment,
        });
        res.status(200).json(receipt);
    } catch (err) {
        next(err);
    }
}

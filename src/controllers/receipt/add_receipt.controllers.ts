import { Request, Response, NextFunction } from "express";
import Receipt from "../../models/receipt.model";
import { AddReceiptRequestBody } from "../../types/receipt.types";
import validateAddReceiptBody from "./helper/validateAddReceiptBody";
import { AuthenticatedRequest } from "../../middlewares/require_auth.middlewares";
import { createFolder } from "../../services/google_drive.service";

function roundTwo(value: number): number {
    return Math.round(value * 100) / 100;
}

export default async function addReceipt(
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> {
    try {
        if (!req.file) {
            res.status(400).json({ message: "No file uploaded" });
            return
        }
        const file = req.file

        const validationError = validateAddReceiptBody(req.body);

        if (validationError !== null) {
            res.status(400).json({ message: validationError });
            return;
        }
        const {
            date,
            typeExpenses,
            companyName,
            address,
            tinNumber,
            gross,
        } = req.body as AddReceiptRequestBody;
        
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

        const uploadedImageLink = await createFolder({
            folderName,
            file,
        });

        const authReq = req as AuthenticatedRequest;
        const receipt = await Receipt.create({
            createdBy: authReq.userId,
            date: date.trim(),
            typeExpenses: typeExpenses.trim(),
            companyName: companyName.trim(),
            address: address.trim(),
            tinNumber: tinNumber.trim(),
            image: uploadedImageLink,
            gross,
            netOfVat,
            inputTax,
            wtax,
            payment
        });
        res.status(201).json(receipt);
    } catch (err) {
        console.log(err)
        next(err);
    }
}

import { Request, Response, NextFunction } from "express";
import Receipt from "../../models/receipt.model";
import { AuthenticatedRequest } from "../../middlewares/require_auth.middlewares";

export default async function deleteReceipt(
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
        await receipt.destroy();
        res.status(204).send();
    } catch (err) {
        next(err);
    }
}

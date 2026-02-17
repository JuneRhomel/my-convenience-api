"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = addReceipt;
const receipt_model_1 = __importDefault(require("../../models/receipt.model"));
const validateAddReceiptBody_1 = __importDefault(require("./helper/validateAddReceiptBody"));
const google_drive_service_1 = require("../../services/google_drive.service");
function roundTwo(value) {
    return Math.round(value * 100) / 100;
}
async function addReceipt(req, res, next) {
    try {
        if (!req.file) {
            res.status(400).json({ message: "No file uploaded" });
            return;
        }
        const file = req.file;
        const validationError = (0, validateAddReceiptBody_1.default)(req.body);
        if (validationError !== null) {
            res.status(400).json({ message: validationError });
            return;
        }
        const { date, typeExpenses, companyName, address, tinNumber, gross, } = req.body;
        const netOfVat = roundTwo(gross / 1.12);
        const inputTax = roundTwo(gross - netOfVat);
        const wtax = 0;
        const payment = roundTwo(gross - wtax);
        const parsedDate = new Date(date);
        const day = parsedDate.getDate();
        const targetDate = day >= 20
            ? new Date(parsedDate.getFullYear(), parsedDate.getMonth() + 1, 20)
            : new Date(parsedDate.getFullYear(), parsedDate.getMonth(), 20);
        const monthShort = targetDate.toLocaleString("en-US", {
            month: "short",
        });
        const year = targetDate.getFullYear();
        const folderName = `${monthShort} 20 ${year}`;
        const uploadedImageLink = await (0, google_drive_service_1.createFolder)({
            folderName,
            file,
        });
        const authReq = req;
        const receipt = await receipt_model_1.default.create({
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
    }
    catch (err) {
        console.log(err);
        next(err);
    }
}

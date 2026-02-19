import { Router } from "express";
import multer from "multer";
import path from "path";

import addReceipt from "../controllers/receipt/add_receipt.controllers";
import editReceipt from "../controllers/receipt/edit_receipt.controllers";
import deleteReceipt from "../controllers/receipt/delete_receipt.controllers";
import requireAuth from "../middlewares/require_auth.middlewares";
import getReceiptList from "../controllers/receipt/get_receipt_list.controllers";
import generateReceiptExcel from "../controllers/receipt/generate_receipt_excel";

const router = Router();

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "uploads/"); // temp folder
    },
    filename: (req, file, cb) => {
        // Preserve original extension
        const ext = path.extname(file.originalname); // .jpg, .png, etc.
        const name = `${Date.now()}-${file.originalname}`;
        cb(null, name);
    },
});

const upload = multer({ storage });

router.post("/", upload.single("file"), requireAuth, addReceipt);
router.put("/:id", upload.single("file"), requireAuth, editReceipt);
router.delete("/:id", requireAuth, deleteReceipt);
router.get("/", requireAuth, getReceiptList);
router.get("/export", requireAuth, generateReceiptExcel);

export default router;

"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const multer_1 = __importDefault(require("multer"));
const path_1 = __importDefault(require("path"));
const add_receipt_controllers_1 = __importDefault(require("../controllers/receipt/add_receipt.controllers"));
const require_auth_middlewares_1 = __importDefault(require("../middlewares/require_auth.middlewares"));
const get_receipt_list_controllers_1 = __importDefault(require("../controllers/receipt/get_receipt_list.controllers"));
const generate_receipt_excel_1 = __importDefault(require("../controllers/receipt/generate_receipt_excel"));
const router = (0, express_1.Router)();
const storage = multer_1.default.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "uploads/"); // temp folder
    },
    filename: (req, file, cb) => {
        // Preserve original extension
        const ext = path_1.default.extname(file.originalname); // .jpg, .png, etc.
        const name = `${Date.now()}-${file.originalname}`;
        cb(null, name);
    },
});
const upload = (0, multer_1.default)({ storage });
router.post("/", upload.single("file"), require_auth_middlewares_1.default, add_receipt_controllers_1.default);
router.get("/", require_auth_middlewares_1.default, get_receipt_list_controllers_1.default);
router.get("/export", require_auth_middlewares_1.default, generate_receipt_excel_1.default);
exports.default = router;

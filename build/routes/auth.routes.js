"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const login_controllers_1 = __importDefault(require("../controllers/auth/login.controllers"));
const login_with_google_controllers_1 = __importDefault(require("../controllers/auth/login_with_google.controllers"));
const sign_up_controllers_1 = __importDefault(require("../controllers/auth/sign_up.controllers"));
const router = (0, express_1.Router)();
router.post("/signup", sign_up_controllers_1.default);
router.post("/login", login_controllers_1.default);
router.post("/google", login_with_google_controllers_1.default);
exports.default = router;

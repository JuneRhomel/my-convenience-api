"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = login;
const bcrypt_1 = __importDefault(require("bcrypt"));
const auth_model_1 = __importDefault(require("../../models/auth.model"));
const token_service_1 = require("../../services/token.service");
const toSafeUser_1 = __importDefault(require("./helper/toSafeUser"));
const validateLoginBody_1 = __importDefault(require("./helper/validateLoginBody"));
const INVALID_CREDENTIALS_MESSAGE = "Invalid email or password";
/**
 * Handles email/password login.
 * Returns user, accessToken and refreshToken on success; 401 on invalid credentials.
 */
async function login(req, res, next) {
    try {
        const validationError = (0, validateLoginBody_1.default)(req.body);
        if (validationError !== null) {
            res.status(400).json({ message: validationError });
            return;
        }
        const { email, password } = req.body;
        const normalizedEmail = email.trim().toLowerCase();
        const user = await auth_model_1.default.findOne({ where: { email: normalizedEmail } });
        if (user === null) {
            res.status(401).json({ message: INVALID_CREDENTIALS_MESSAGE });
            return;
        }
        if (user.password === null) {
            res.status(401).json({ message: INVALID_CREDENTIALS_MESSAGE });
            return;
        }
        const isPasswordValid = await bcrypt_1.default.compare(password, user.password);
        if (!isPasswordValid) {
            res.status(401).json({ message: INVALID_CREDENTIALS_MESSAGE });
            return;
        }
        const { accessToken, refreshToken } = await (0, token_service_1.createTokens)(user.id, user.name);
        res.status(200).json({
            user: (0, toSafeUser_1.default)(user),
            accessToken,
            refreshToken
        });
    }
    catch (err) {
        next(err);
    }
}

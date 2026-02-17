"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = signUp;
const bcrypt_1 = __importDefault(require("bcrypt"));
const auth_constants_1 = require("../../constants/auth_constants");
const auth_model_1 = __importDefault(require("../../models/auth.model"));
const toSafeUser_1 = __importDefault(require("./helper/toSafeUser"));
const validateSignUpBody_1 = __importDefault(require("./helper/validateSignUpBody"));
/**
 * Handles email/password sign-up.
 * Fields: name, lastName, email, phoneNumber, password.
 */
async function signUp(req, res, next) {
    try {
        const validationError = (0, validateSignUpBody_1.default)(req.body);
        if (validationError !== null) {
            res.status(400).json({ message: validationError });
            return;
        }
        const { name, lastName, email, phoneNumber, password } = req.body;
        const existingUser = await auth_model_1.default.findOne({ where: { email } });
        if (existingUser !== null) {
            res.status(409).json({ message: "Email already registered" });
            return;
        }
        const hashedPassword = await bcrypt_1.default.hash(password, auth_constants_1.SALT_ROUNDS);
        const user = await auth_model_1.default.create({
            name: name.trim(),
            lastName: lastName.trim(),
            email: email.trim().toLowerCase(),
            phoneNumber: phoneNumber.trim(),
            password: hashedPassword
        });
        res.status(201).json((0, toSafeUser_1.default)(user));
    }
    catch (err) {
        next(err);
    }
}

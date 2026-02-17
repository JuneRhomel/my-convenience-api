"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = loginWithGoogle;
const auth_model_1 = __importDefault(require("../../models/auth.model"));
const toSafeUser_1 = __importDefault(require("./helper/toSafeUser"));
const token_service_1 = require("../../services/token.service");
const jwt_decode_1 = require("jwt-decode");
/**
 * Handles login or sign-up via Google account.
 * Finds user by googleId or email; creates user if not found.
 * Returns user, accessToken and refreshToken.
 */
async function loginWithGoogle(req, res, next) {
    try {
        if (!req.body) {
            res.status(400).json({ message: "" });
            return;
        }
        const googleDecode = (0, jwt_decode_1.jwtDecode)(req.body.data);
        const { sub, email, given_name, family_name } = googleDecode;
        const normalizedEmail = email.trim().toLowerCase();
        const trimmedName = given_name.trim();
        const trimmedLastName = family_name.trim();
        const googleId = sub;
        let user = await auth_model_1.default.findOne({ where: { googleId } });
        if (user !== null) {
            const { accessToken, refreshToken } = await (0, token_service_1.createTokens)(user.id, user.name);
            res.status(200).json({
                user: (0, toSafeUser_1.default)(user),
                accessToken,
                refreshToken
            });
            return;
        }
        user = await auth_model_1.default.findOne({ where: { email: normalizedEmail } });
        if (user !== null) {
            await user.update({
                googleId,
                name: trimmedName,
                lastName: trimmedLastName,
            });
            const { accessToken, refreshToken } = await (0, token_service_1.createTokens)(user.id, user.name);
            res.status(200).json({
                user: (0, toSafeUser_1.default)(user),
                accessToken,
                refreshToken
            });
            return;
        }
        const newUser = await auth_model_1.default.create({
            googleId,
            name: trimmedName,
            lastName: trimmedLastName,
            email: normalizedEmail,
            password: null
        });
        const { accessToken, refreshToken } = await (0, token_service_1.createTokens)(newUser.id, newUser.name);
        res.status(201).json({
            user: (0, toSafeUser_1.default)(newUser),
            accessToken,
            refreshToken
        });
    }
    catch (err) {
        next(err);
    }
}

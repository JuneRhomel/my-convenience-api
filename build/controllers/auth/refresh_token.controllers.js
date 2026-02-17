"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = refreshToken;
const auth_model_1 = __importDefault(require("../../models/auth.model"));
const token_service_1 = require("../../services/token.service");
const toSafeUser_1 = __importDefault(require("./helper/toSafeUser"));
const validateBearerToken_1 = __importDefault(require("./helper/validateBearerToken"));
const validateRefreshTokenBody_1 = __importDefault(require("./helper/validateRefreshTokenBody"));
const INVALID_REFRESH_TOKEN_MESSAGE = "Invalid or expired refresh token";
/**
 * Exchanges a valid refresh token for new access and refresh tokens.
 * Uses refresh token rotation (old token is consumed).
 */
async function refreshToken(req, res, next) {
    try {
        // validate the bearer token
        const bearerToken = req.headers.authorization ?? "";
        const bearerTokenError = (0, validateBearerToken_1.default)(bearerToken);
        if (!bearerTokenError) {
            res.status(401).json({ message: bearerTokenError });
            return;
        }
        const validationError = (0, validateRefreshTokenBody_1.default)(req.body);
        if (validationError !== null) {
            res.status(400).json({ message: validationError });
            return;
        }
        const { refreshToken: token } = req.body;
        const userId = await (0, token_service_1.findAndConsumeRefreshToken)(token.trim());
        if (userId === null) {
            res.status(401).json({ message: INVALID_REFRESH_TOKEN_MESSAGE });
            return;
        }
        const user = await auth_model_1.default.findByPk(userId);
        if (user === null) {
            res.status(401).json({ message: INVALID_REFRESH_TOKEN_MESSAGE });
            return;
        }
        const { accessToken, refreshToken: newRefreshToken } = await (0, token_service_1.createTokens)(user.id, user.name);
        res.status(200).json({
            user: (0, toSafeUser_1.default)(user),
            accessToken,
            refreshToken: newRefreshToken
        });
    }
    catch (err) {
        next(err);
    }
}

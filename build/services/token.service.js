"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateAccessToken = generateAccessToken;
exports.createRefreshToken = createRefreshToken;
exports.findAndConsumeRefreshToken = findAndConsumeRefreshToken;
exports.createTokens = createTokens;
const crypto_1 = __importDefault(require("crypto"));
const config_1 = __importDefault(require("../config/config"));
const refresh_token_model_1 = __importDefault(require("../models/refresh_token.model"));
const TOKEN_BYTES = 40;
const MS_PER_SECOND = 1000;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
/**
 * Generates a JWT access token for the given user id.
 */
function generateAccessToken(userId, name) {
    return jsonwebtoken_1.default.sign({ sub: userId, name }, config_1.default.jwtAccessSecret, { expiresIn: config_1.default.jwtAccessExpiry });
}
exports.default = generateAccessToken;
/**
 * Parses expiry string (e.g. "7d") into milliseconds for Date calculation.
 */
function parseExpiryToMilliseconds(expiry) {
    const match = expiry.match(/^(\d+)([smhd])$/);
    if (match === null) {
        return Number(config_1.default.jwtRefreshExpiry) * MS_PER_SECOND;
    }
    const value = Number(match[1]);
    const unit = match[2];
    const multipliers = {
        s: MS_PER_SECOND,
        m: 60 * MS_PER_SECOND,
        h: 60 * 60 * MS_PER_SECOND,
        d: 24 * 60 * 60 * MS_PER_SECOND
    };
    return value * (multipliers[unit] ?? MS_PER_SECOND);
}
/**
 * Creates a refresh token, stores it in DB, and returns the token string.
 */
async function createRefreshToken(userId) {
    const token = crypto_1.default.randomBytes(TOKEN_BYTES).toString("hex");
    const expiresAt = new Date(Date.now() + parseExpiryToMilliseconds(config_1.default.jwtRefreshExpiry));
    await refresh_token_model_1.default.create({ userId, token, expiresAt });
    return token;
}
/**
 * Finds refresh token, validates expiry, deletes it (one-time use), returns userId or null.
 */
async function findAndConsumeRefreshToken(token) {
    const record = await refresh_token_model_1.default.findOne({ where: { token } });
    if (record === null) {
        return null;
    }
    if (record.expiresAt < new Date()) {
        await record.destroy();
        return null;
    }
    await record.destroy();
    return record.userId;
}
/**
 * Creates both access and refresh tokens for the user. Saves refresh token in DB.
 */
async function createTokens(userId, name) {
    const accessToken = generateAccessToken(userId, name);
    const refreshToken = await createRefreshToken(userId);
    return { accessToken, refreshToken };
}

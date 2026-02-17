import crypto from "crypto";
import config from "../config/config";
import RefreshToken from "../models/refresh_token.model";

const TOKEN_BYTES = 40;
const MS_PER_SECOND = 1000;

import jwt, { Secret } from "jsonwebtoken";
import { SignOptions } from "jsonwebtoken";

/**
 * Generates a JWT access token for the given user id.
 */

function generateAccessToken(userId: number, name: string): string {
    return jwt.sign(
        { sub: userId, name },
        config.jwtAccessSecret as Secret,
        { expiresIn: config.jwtAccessExpiry as SignOptions["expiresIn"] }
    );
}

export default generateAccessToken;

/**
 * Parses expiry string (e.g. "7d") into milliseconds for Date calculation.
 */
function parseExpiryToMilliseconds(expiry: string): number {
    const match = expiry.match(/^(\d+)([smhd])$/);
    if (match === null) {
        return Number(config.jwtRefreshExpiry) * MS_PER_SECOND;
    }
    const value = Number(match[1]);
    const unit = match[2];
    const multipliers: Record<string, number> = {
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
async function createRefreshToken(userId: number): Promise<string> {
    const token = crypto.randomBytes(TOKEN_BYTES).toString("hex");
    const expiresAt = new Date(
        Date.now() + parseExpiryToMilliseconds(config.jwtRefreshExpiry)
    );
    await RefreshToken.create({ userId, token, expiresAt });
    return token;
}

/**
 * Finds refresh token, validates expiry, deletes it (one-time use), returns userId or null.
 */
async function findAndConsumeRefreshToken(token: string): Promise<number | null> {
    const record = await RefreshToken.findOne({ where: { token } });
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
async function createTokens(userId: number, name: string): Promise<{
    accessToken: string;
    refreshToken: string;
}> {
    const accessToken = generateAccessToken(userId, name);
    const refreshToken = await createRefreshToken(userId);
    return { accessToken, refreshToken };
}

export {
    generateAccessToken,
    createRefreshToken,
    findAndConsumeRefreshToken,
    createTokens
};

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Validates refresh token request body. Returns error message or null if valid.
 */
function validateRefreshTokenBody(body) {
    if (body === null || typeof body !== "object") {
        return "Invalid request body";
    }
    const b = body;
    if (typeof b.refreshToken !== "string" || !b.refreshToken.trim()) {
        return "refreshToken is required";
    }
    return null;
}
exports.default = validateRefreshTokenBody;

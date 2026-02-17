"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Returns user data without sensitive fields for API response.
 */
function toSafeUser(user) {
    const plain = user.get({ plain: true });
    const { password: _omit, googleId: _omitGoogleId, ...safe } = plain;
    return {
        id: safe.id,
        name: safe.name,
        lastName: safe.lastName,
        email: safe.email,
        phoneNumber: safe.phoneNumber,
        createdAt: safe.createdAt,
        updatedAt: safe.updatedAt
    };
}
exports.default = toSafeUser;

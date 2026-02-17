import User from "../../../models/auth.model";
import { SafeUserResponse } from "../../../types/auth.types";

/**
 * Returns user data without sensitive fields for API response.
 */
function toSafeUser(user: User): SafeUserResponse {
    const plain = user.get({ plain: true }) as User & { password?: string };
    const { password: _omit, googleId: _omitGoogleId, ...safe } = plain;
    return {
        id: safe.id,
        name: safe.name,
        lastName: safe.lastName,
        email: safe.email,
        phoneNumber: safe.phoneNumber,
        createdAt: safe.createdAt,
        updatedAt: safe.updatedAt
    } as SafeUserResponse;
}

export default toSafeUser;
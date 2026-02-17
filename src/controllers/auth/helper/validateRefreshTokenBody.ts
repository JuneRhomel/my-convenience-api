/**
 * Validates refresh token request body. Returns error message or null if valid.
 */
function validateRefreshTokenBody(body: unknown): string | null {
    if (body === null || typeof body !== "object") {
        return "Invalid request body";
    }
    const b = body as Record<string, unknown>;
    if (typeof b.refreshToken !== "string" || !b.refreshToken.trim()) {
        return "refreshToken is required";
    }
    return null;
}

export default validateRefreshTokenBody;
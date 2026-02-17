const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/**
 * Validates Google auth request body. Returns error message or null if valid.
 */
function validateGoogleAuthBody(body: unknown): string | null {
    if (body === null || typeof body !== "object") {
        return "Invalid request body";
    }
    const b = body as Record<string, unknown>;
    if (typeof b.googleId !== "string" || !b.googleId.trim()) {
        return "googleId is required";
    }
    if (typeof b.email !== "string" || !b.email.trim()) {
        return "email is required";
    }
    if (!EMAIL_REGEX.test(b.email)) {
        return "Invalid email format";
    }
    if (typeof b.name !== "string" || !b.name.trim()) {
        return "name is required";
    }
    if (typeof b.lastName !== "string" || !b.lastName.trim()) {
        return "lastName is required";
    }
    return null;
}

export default validateGoogleAuthBody;
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/**
 * Validates login request body. Returns error message or null if valid.
 */
function validateLoginBody(body: unknown): string | null {
    if (body === null || typeof body !== "object") {
        return "Invalid request body";
    }
    const b = body as Record<string, unknown>;
    if (typeof b.email !== "string" || !b.email.trim()) {
        return "email is required";
    }
    if (!EMAIL_REGEX.test(b.email)) {
        return "Invalid email format";
    }
    if (typeof b.password !== "string" || b.password.length < 6) {
        return "password is required and must be at least 6 characters";
    }
    return null;
}

export default validateLoginBody;

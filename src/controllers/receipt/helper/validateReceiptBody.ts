function validateReceiptBody(body: unknown): string | null {
    if (body === null || typeof body !== "object") {
        return "Invalid request body";
    }
    const b = body as Record<string, unknown>;
    if (typeof b.date !== "string" || !b.date.trim()) {
        return "date is required";
    }
    if (typeof b.typeExpenses !== "string" || !b.typeExpenses.trim()) {
        return "typeExpenses is required";
    }
    if (typeof b.companyName !== "string" || !b.companyName.trim()) {
        return "companyName is required";
    }
    if (typeof b.address !== "string" || !b.address.trim()) {
        return "address is required";
    }
    if (typeof b.tinNumber !== "string" || !b.tinNumber.trim()) {
        return "tinNumber is required";
    }
    return null;
}

export default validateReceiptBody;

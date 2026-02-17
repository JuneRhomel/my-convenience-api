import { Request, Response, NextFunction } from "express";
import validateBearerToken from "./helper/validateBearerToken";


export interface AuthenticatedRequest extends Request {
    userId: number;
    name: string;
}

/**
 * Middleware that validates Bearer token and sets req.userId.
 * Responds with 401 if Authorization header is missing or token is invalid.
 */
function requireAuth(
    req: Request,
    res: Response,
    next: NextFunction
): void {
    const authHeader = req.headers.authorization;
    if (typeof authHeader !== "string" || !authHeader) {
        throw new Error("Authorization header is required");
    }
    const result = validateBearerToken(authHeader);
    if (typeof result === "string") {
        throw new Error(result);
    }
    const { userId, name } = result;

    (req as AuthenticatedRequest).userId = userId;
    (req as AuthenticatedRequest).name = name;
    next();
}

export default requireAuth;

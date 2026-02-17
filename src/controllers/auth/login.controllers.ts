import { Request, Response, NextFunction } from "express";
import bcrypt from "bcrypt";
import User from "../../models/auth.model";
import { createTokens } from "../../services/token.service";
import { LoginRequestBody } from "../../types/auth.types";
import toSafeUser from "./helper/toSafeUser";
import validateLoginBody from "./helper/validateLoginBody";


const INVALID_CREDENTIALS_MESSAGE = "Invalid email or password";

/**
 * Handles email/password login.
 * Returns user, accessToken and refreshToken on success; 401 on invalid credentials.
 */
export default async function login(
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> {
    try {
        const validationError = validateLoginBody(req.body);
        if (validationError !== null) {
            res.status(400).json({ message: validationError });
            return;
        }
        const { email, password } = req.body as LoginRequestBody;
        const normalizedEmail = email.trim().toLowerCase();
        const user = await User.findOne({ where: { email: normalizedEmail } });
        if (user === null) {
            res.status(401).json({ message: INVALID_CREDENTIALS_MESSAGE });
            return;
        }
        if (user.password === null) {
            res.status(401).json({ message: INVALID_CREDENTIALS_MESSAGE });
            return;
        }
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            res.status(401).json({ message: INVALID_CREDENTIALS_MESSAGE });
            return;
        }
        const { accessToken, refreshToken } = await createTokens(user.id, user.name);
        res.status(200).json({
            user: toSafeUser(user),
            accessToken,
            refreshToken
        });
    } catch (err) {
        next(err);
    }
}

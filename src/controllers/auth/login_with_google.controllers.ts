import { Request, Response, NextFunction } from "express";
import User from "../../models/auth.model";
import toSafeUser from "./helper/toSafeUser";
import validateGoogleAuthBody from "./helper/validateGoogleAuthBody";
import { createTokens } from "../../services/token.service";
import { GoogleAuthRequestBody } from "../../types/auth.types";
import { jwtDecode } from "jwt-decode";

/**
 * Handles login or sign-up via Google account.
 * Finds user by googleId or email; creates user if not found.
 * Returns user, accessToken and refreshToken.
 */
export default async function loginWithGoogle(
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> {
    try {
        if (!req.body) {
            res.status(400).json({ message: "" });
            return;
        }

        const googleDecode = jwtDecode(req.body.data)

        const { sub, email, given_name, family_name } =
            googleDecode as GoogleAuthRequestBody;

        const normalizedEmail = email.trim().toLowerCase();
        const trimmedName = given_name.trim();
        const trimmedLastName = family_name.trim();
        const googleId = sub

        let user = await User.findOne({ where: { googleId } });

        if (user !== null) {
            const { accessToken, refreshToken } = await createTokens(user.id, user.name);
            res.status(200).json({
                user: toSafeUser(user),
                accessToken,
                refreshToken
            });
            return;
        }
        user = await User.findOne({ where: { email: normalizedEmail } });
        if (user !== null) {
            await user.update({
                googleId,
                name: trimmedName,
                lastName: trimmedLastName,
            });
            const { accessToken, refreshToken } = await createTokens(user.id, user.name);
            res.status(200).json({
                user: toSafeUser(user),
                accessToken,
                refreshToken
            });
            return;
        }
        const newUser = await User.create({
            googleId,
            name: trimmedName,
            lastName: trimmedLastName,
            email: normalizedEmail,
            password: null
        });
        const { accessToken, refreshToken } = await createTokens(newUser.id, newUser.name);
        res.status(201).json({
            user: toSafeUser(newUser),
            accessToken,
            refreshToken
        });
    } catch (err) {
        next(err);
    }
}

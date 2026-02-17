import { Request, Response, NextFunction } from "express";
import User from "../../models/auth.model";
import { findAndConsumeRefreshToken, createTokens } from "../../services/token.service";
import { RefreshTokenRequestBody } from "../../types/auth.types";
import toSafeUser from "./helper/toSafeUser";
import validateBearerToken from "./helper/validateBearerToken";
import validateRefreshTokenBody from "./helper/validateRefreshTokenBody";

const INVALID_REFRESH_TOKEN_MESSAGE = "Invalid or expired refresh token";


/**
 * Exchanges a valid refresh token for new access and refresh tokens.
 * Uses refresh token rotation (old token is consumed).
 */
export default async function refreshToken(
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> {
    try {

        // validate the bearer token
        const bearerToken = req.headers.authorization ?? "";
        const bearerTokenError = validateBearerToken(bearerToken);
        if (!bearerTokenError) {
            res.status(401).json({ message: bearerTokenError });
            return;
        }

        const validationError = validateRefreshTokenBody(req.body);
        if (validationError !== null) {
            res.status(400).json({ message: validationError });
            return;
        }
        const { refreshToken: token } = req.body as RefreshTokenRequestBody;
        const userId = await findAndConsumeRefreshToken(token.trim());
        if (userId === null) {
            res.status(401).json({ message: INVALID_REFRESH_TOKEN_MESSAGE });
            return;
        }
        const user = await User.findByPk(userId);
        if (user === null) {
            res.status(401).json({ message: INVALID_REFRESH_TOKEN_MESSAGE });
            return;
        }
        const { accessToken, refreshToken: newRefreshToken } =
            await createTokens(user.id, user.name);
        res.status(200).json({
            user: toSafeUser(user),
            accessToken,
            refreshToken: newRefreshToken
        });
    } catch (err) {
        next(err);
    }
}

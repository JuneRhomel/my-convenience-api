import { JwtPayload, Secret } from "jsonwebtoken";
import config from "../../../config/config";
import jwt from "jsonwebtoken";

function validateBearerToken(bearerToken: string): { userId: number; name: string } | string {
    if (!bearerToken.startsWith("Bearer ")) {
        return "Authorization header must start with 'Bearer '";
    }
    const token = bearerToken.split(" ")[1];
    if (!token) {
        return "Authorization header must contain a token";
    }
    const decoded = jwt.verify(
        token,
        config.jwtAccessSecret as Secret
    ) as JwtPayload;
    if (decoded.sub === undefined) {
        return "Invalid bearer token";
    }
    return { userId: parseInt(decoded.sub, 10), name: decoded.name as string };
}

export default validateBearerToken;
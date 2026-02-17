import { Request, Response, NextFunction } from "express";
import bcrypt from "bcrypt";
import { SALT_ROUNDS } from "../../constants/auth_constants";
import User from "../../models/auth.model";
import { SignUpRequestBody } from "../../types/auth.types";
import toSafeUser from "./helper/toSafeUser";
import validateSignUpBody from "./helper/validateSignUpBody";



/**
 * Handles email/password sign-up.
 * Fields: name, lastName, email, phoneNumber, password.
 */
export default async function signUp(
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> {
    try {
        const validationError = validateSignUpBody(req.body);
        if (validationError !== null) {
            res.status(400).json({ message: validationError });
            return;
        }
        const { name, lastName, email, phoneNumber, password } =
            req.body as SignUpRequestBody;
        const existingUser = await User.findOne({ where: { email } });
        if (existingUser !== null) {
            res.status(409).json({ message: "Email already registered" });
            return;
        }
        const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);
        const user = await User.create({
            name: name.trim(),
            lastName: lastName.trim(),
            email: email.trim().toLowerCase(),
            phoneNumber: phoneNumber.trim(),
            password: hashedPassword
        });
        res.status(201).json(toSafeUser(user));
    } catch (err) {
        next(err);
    }
}
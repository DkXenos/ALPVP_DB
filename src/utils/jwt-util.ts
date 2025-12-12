import jwt from "jsonwebtoken"
import { UserJWTPayload } from "../models/user-model"
import { JWT_SECRET_KEY } from "./env-util"

const DEFAULT_SECRET: string =
    (JWT_SECRET_KEY as string) ||
    (process.env.JWT_SECRET as string) ||
    "change_this_in_prod"

export const generateToken = (payload: UserJWTPayload, expiryTime = "7d"): string => {
    return jwt.sign(payload, DEFAULT_SECRET, {
        expiresIn: expiryTime,
    } as jwt.SignOptions)
}

export const verifyToken = (token: string): UserJWTPayload => {
    return jwt.verify(token, DEFAULT_SECRET) as UserJWTPayload
}

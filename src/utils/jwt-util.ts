import jwt from "jsonwebtoken"
import { UserJWTPayload } from "../models/user-model"
import { JWT_SECRET_KEY } from "./env-util"

export type CompanyJWTPayload = {
    id: number
    email: string
    name: string
    type: "company"
}

export type JWTPayload = UserJWTPayload | CompanyJWTPayload

const DEFAULT_SECRET: string =
    (JWT_SECRET_KEY as string) ||
    (process.env.JWT_SECRET as string) ||
    "change_this_in_prod"

export const generateToken = (payload: JWTPayload, expiryTime = "7d"): string => {
    return jwt.sign(payload as object, DEFAULT_SECRET, {
        expiresIn: expiryTime,
    } as jwt.SignOptions)
}

export const verifyToken = (token: string): JWTPayload => {
    return jwt.verify(token, DEFAULT_SECRET) as JWTPayload
}

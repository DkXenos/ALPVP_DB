import { NextFunction, Response } from "express"
import { UserRequest } from "../models/user-request-model"
import { ResponseError } from "../error/response-error"
import { verifyToken } from "../utils/jwt-util"

export const authMiddleware = (
    req: UserRequest,
    res: Response,
    next: NextFunction
) => {
    try {
        const authHeader = req.headers["authorization"]

        if (!authHeader) {
            return next(new ResponseError(401, "Missing Authorization header"))
        }

        // Diekstrak Bearer token dari header
        const parts = authHeader.split(" ")

        if (parts.length !== 2 || parts[0] !== "Bearer") {
            return next(new ResponseError(401, "Invalid Authorization header format"))
        }

        const token = parts[1]

        if (!token) {
            return next(new ResponseError(401, "Token not provided"))
        }

        const payload = verifyToken(token)

        if (!payload) {
            return next(new ResponseError(401, "Invalid or expired token"))
        }

        // Attach payload (user or company) to request object
        req.user = payload as any

        return next()
    } catch (error) {
        return next(new ResponseError(401, "Unauthorized user!"))
    }
}

import { Request, Response, NextFunction } from "express"
import {
    LoginUserRequest,
    RegisterUserRequest,
    UserResponse,
} from "../models/user-model"
import { UserService } from "../services/user-service"
import { UserRequest } from "../models/user-request-model"

export class UserController {
    static async register(req: Request, res: Response, next: NextFunction) {
        try {
            const request: RegisterUserRequest = req.body as RegisterUserRequest
            const response: UserResponse = await UserService.register(request)

            res.status(200).json({
                data: response,
            })
        } catch (error) {
            next(error)
        }
    }

    static async login(req: Request, res: Response, next: NextFunction) {
        try {
            const request: LoginUserRequest = req.body as LoginUserRequest
            const response: UserResponse = await UserService.login(request)

            res.status(200).json({
                data: response,
            })
        } catch (error) {
            next(error)
        }
    }

    static async uploadProfileImage(req: UserRequest, res: Response, next: NextFunction) {
        try {
            if (!req.user) {
                return res.status(401).json({ errors: "Unauthorized" })
            }

            if (!req.file) {
                return res.status(400).json({ errors: "No file uploaded" })
            }

            const response = await UserService.uploadProfileImage(req.user.id, req.file.filename)
            res.status(200).json({ data: response })
        } catch (error) {
            // Delete uploaded file if error occurs
            if (req.file) {
                const fs = await import("fs")
                const path = await import("path")
                const filePath = path.join(__dirname, "../../public/uploads/users", req.file.filename)
                if (fs.existsSync(filePath)) {
                    fs.unlinkSync(filePath)
                }
            }
            next(error)
        }
    }

    static async deleteProfileImage(req: UserRequest, res: Response, next: NextFunction) {
        try {
            if (!req.user) {
                return res.status(401).json({ errors: "Unauthorized" })
            }

            const response = await UserService.deleteProfileImage(req.user.id)
            res.status(200).json({ data: response })
        } catch (error) {
            next(error)
        }
    }
}
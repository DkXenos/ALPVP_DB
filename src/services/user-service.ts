import { ResponseError } from "../error/response-error"
import {
    LoginUserRequest,
    RegisterUserRequest,
    toUserResponse,
    UserResponse,
} from "../models/user-model"
import { prismaClient } from "../utils/database-util"
import { UserValidation } from "../validations/user-validation"
import { Validation } from "../validations/validation"
import bcrypt from "bcrypt"

export class UserService {
    static async register(request: RegisterUserRequest): Promise<UserResponse> {
        const validatedData = Validation.validate(UserValidation.REGISTER, request)

        // Ngecek email udah ada apa belum
        const existing = await prismaClient.user.findFirst({
            where: { email: validatedData.email },
        })
        if (existing) {
            throw new ResponseError(400, "Email has already existed!")
        }

        // Password di hash
        const hashed = await bcrypt.hash(validatedData.password, 10)

        // Create user with placeholder profile image
        const user = await prismaClient.user.create({
            data: {
                username: validatedData.username,
                email: validatedData.email,
                password: hashed,
                profile_image: "/uploads/users/user_placeholder.png",
            },
        })

        // return full response with token + user info
        return toUserResponse(user.id, user.username, user.email)
    }

    static async login(request: LoginUserRequest): Promise<UserResponse> {
        const validatedData = Validation.validate(UserValidation.LOGIN, request)

        const user = await prismaClient.user.findFirst({
            where: { email: validatedData.email },
        })

        if (!user) {
            throw new ResponseError(400, "Invalid email or password!")
        }

        const passwordIsValid = await bcrypt.compare(validatedData.password, user.password)
        if (!passwordIsValid) {
            throw new ResponseError(400, "Invalid email or password!")
        }

        return toUserResponse(user.id, user.username, user.email)
    }

    static async uploadProfileImage(userId: number, filename: string): Promise<{ profile_image: string }> {
        // Get existing user to delete old image if exists
        const user = await prismaClient.user.findUnique({
            where: { id: userId },
        })

        if (!user) {
            throw new ResponseError(404, "User not found")
        }

        // Delete old image file if exists and not placeholder
        if (user.profile_image && !user.profile_image.includes("placeholder")) {
            const fs = await import("fs")
            const path = await import("path")
            const oldPath = path.join(__dirname, "../../public", user.profile_image)
            if (fs.existsSync(oldPath)) {
                fs.unlinkSync(oldPath)
            }
        }

        // Update user with new image path
        const imageUrl = `/uploads/users/${filename}`
        await prismaClient.user.update({
            where: { id: userId },
            data: { profile_image: imageUrl },
        })

        return { profile_image: imageUrl }
    }

    static async deleteProfileImage(userId: number): Promise<{ profile_image: string }> {
        const user = await prismaClient.user.findUnique({
            where: { id: userId },
        })

        if (!user) {
            throw new ResponseError(404, "User not found")
        }

        // Delete image file if exists
        if (user.profile_image && !user.profile_image.includes("placeholder")) {
            const fs = await import("fs")
            const path = await import("path")
            const imagePath = path.join(__dirname, "../../public", user.profile_image)
            if (fs.existsSync(imagePath)) {
                fs.unlinkSync(imagePath)
            }
        }

        // Update user to placeholder
        const defaultImage = "/uploads/users/user_placeholder.png"
        await prismaClient.user.update({
            where: { id: userId },
            data: { profile_image: defaultImage },
        })

        return { profile_image: defaultImage }
    }
}

import { generateToken } from "../utils/jwt-util"

export interface UserJWTPayload {
    id: number
    username?: string
    name?: string
    email: string
}

export interface RegisterUserRequest {
    username: string
    email: string
    password: string
}

export interface LoginUserRequest {
    email: string
    password: string
}

export interface UserResponse {
    id: number
    username: string
    email: string
    token: string
}

export function toUserResponse(id: number, username: string, email: string): UserResponse {
    const token = generateToken({ id, username, email }, "7d")

    return {
        id,
        username,
        email,
        token,
    }
}

import { generateToken } from "../utils/jwt-util"

export interface UserJWTPayload {
    id: number
    username: string
    email: string
    role?: string
}

export interface RegisterUserRequest {
    username: string
    email: string
    password: string
    role?: "TALENT" | "COMPANY"
}

export interface LoginUserRequest {
    email: string
    password: string
}

export interface UserResponse {
    id: number
    username: string
    email: string
    role: string
    token: string
}

export function toUserResponse(
    id: number,
    username: string,
    email: string,
    role: string = "TALENT"
): UserResponse {
    const token = generateToken(
        {
            id,
            username,
            email,
            role,
        },
        "7d" //Expired
    )

    return {
        id,
        username,
        email,
        role,
        token,
    }
}

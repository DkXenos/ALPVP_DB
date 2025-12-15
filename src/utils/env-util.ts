import dotenv from "dotenv"

dotenv.config()

export const PORT: number = Number(process.env.PORT) || 4000
export const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY
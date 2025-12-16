import { z, ZodType } from "zod"

export class UserValidation {
    static readonly REGISTER: ZodType = z.object({
        username: z
            .string()
            .min(1, "Username can not be empty!"),

        email: z
            .string()
            .email("Email format is invalid!")
            .min(1, "Email can not be empty!"),

        password: z
            .string()
            .min(8, "Password must contain more than or equal to 8 characters!"),
    })

    static readonly LOGIN: ZodType = z.object({
        email: z
            .string()
            .email("Email format is invalid!")
            .min(1, "Email can not be empty!"),

        password: z
            .string()
            .min(8, "Password must contain more than or equal to 8 characters!"),
    })
}

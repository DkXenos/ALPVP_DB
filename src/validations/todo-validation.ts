import z, { ZodType } from "zod"

export class TodoValidation {
    static readonly CREATE_UPDATE: ZodType = z.object({
        title: z
            .string({
                error: "Title must be string!",
            })
            .min(1, {
                error: "Title can not be empty!",
            }),
        description: z
            .string({
                error: "Title must be string!",
            })
            .min(1, {
                error: "Title can not be empty!",
            }),
        status: z
            .string({
                error: "Title must be string!",
            })
            .min(1, {
                error: "Title can not be empty!",
            }),
        priority: z
            .string({
                error: "Title must be string!",
            })
            .min(1, {
                error: "Title can not be empty!",
            }),
        due_date: z
            .string({
                error: "Title must be string!",
            })
            .min(1, {
                error: "Title can not be empty!",
            }),
    })
}
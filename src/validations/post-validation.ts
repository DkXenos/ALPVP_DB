import { z, ZodType } from "zod";

export class PostValidation {
  static readonly CREATE_POST: ZodType = z.object({
    user_id: z.number().positive(),
    content: z.string().min(1).max(10000),
    image: z.string().max(500).optional(),
  });

  static readonly UPDATE_POST: ZodType = z.object({
    content: z.string().min(1).max(10000).optional(),
    image: z.string().max(500).optional(),
  });
}

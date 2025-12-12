import { z, ZodType } from "zod";

export class CommentValidation {
  static readonly CREATE_COMMENT: ZodType = z.object({
    post_id: z.number().positive(),
    content: z.string().min(1).max(5000),
  });

  static readonly UPDATE_COMMENT: ZodType = z.object({
    content: z.string().min(1).max(5000).optional(),
  });
}

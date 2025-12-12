import {z, ZodType} from "zod";

export class EventValidation {
  static readonly CREATE_EVENT: ZodType = z.object({
      post_id: z.number().positive(),
      content: z.string().min(1).max(5000),
  });
  
    static readonly UPDATE_EVENT: ZodType = z.object({
      content: z.string().min(1).max(5000).optional(),
  });
}
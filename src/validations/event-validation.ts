import {z, ZodType} from "zod";

export class EventValidation {
  static readonly CREATE_EVENT: ZodType = z.object({
    title: z.string().min(1).max(100),
    description: z.string().min(1),
    event_date: z.string().refine((val) => !isNaN(Date.parse(val)), {
      message: "Invalid date format",
    }),
    company_id: z.number().positive(),
    registered_quota: z.number().positive(),
  });
  
  static readonly UPDATE_EVENT: ZodType = z.object({
    title: z.string().min(1).max(100).optional(),
    description: z.string().min(1).optional(),
    event_date: z.string().refine((val) => !isNaN(Date.parse(val)), {
      message: "Invalid date format",
    }).optional(),
    registered_quota: z.number().positive().optional(),
  });

  static readonly REGISTER_EVENT: ZodType = z.object({
    user_id: z.number().positive(),
    event_id: z.number().positive(),
  });
}

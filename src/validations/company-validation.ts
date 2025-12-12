import {z, ZodType} from "zod";

export class CompanyValidation {
  static readonly CREATE_COMPANY: ZodType = z.object({
    name: z.string().min(1).max(150),
    description: z.string().optional(),
    email: z.string().email().max(150),
  });
  
  static readonly UPDATE_COMPANY: ZodType = z.object({
    name: z.string().min(1).max(150).optional(),
    description: z.string().optional(),
    email: z.string().email().max(150).optional(),
  });
}

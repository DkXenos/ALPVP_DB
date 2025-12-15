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

  static readonly REGISTER_COMPANY: ZodType = z.object({
    name: z.string().min(1).max(150),
    email: z.string().email().max(150),
    password: z.string().min(6).max(100),
    description: z.string().optional(),
  });

  static readonly LOGIN_COMPANY: ZodType = z.object({
    email: z.string().email().max(150),
    password: z.string().min(1).max(100),
  });
}

import { z, ZodType } from "zod";

export class BountyValidation {
  static readonly CREATE_BOUNTY: ZodType = z.object({
    title: z.string().min(1).max(200),
    company: z.string().min(1).max(150),
    deadline: z.string().datetime(),
    rewardXp: z.number().int().min(0),
    rewardMoney: z.number().int().min(0),
    status: z.string().min(1).max(20),
  });

  static readonly UPDATE_BOUNTY: ZodType = z.object({
    title: z.string().min(1).max(200).optional(),
    company: z.string().min(1).max(150).optional(),
    deadline: z.string().datetime().optional(),
    rewardXp: z.number().int().min(0).optional(),
    rewardMoney: z.number().int().min(0).optional(),
    status: z.string().min(1).max(20).optional(),
  });
}

import { z, ZodType } from "zod";

export class BountyValidation {
  static readonly CREATE_BOUNTY: ZodType = z.object({
    title: z.string().min(1).max(200),
    company: z.string().min(1).max(150),
    deadline: z.string().min(1).max(100),
    rewardXp: z.number().int().min(0),
    rewardMoney: z.number().int().min(0),
    description: z.string().optional(),
    requirements: z.array(z.string()).min(1),
  });

  static readonly UPDATE_BOUNTY: ZodType = z.object({
    title: z.string().min(1).max(200).optional(),
    company: z.string().min(1).max(150).optional(),
    deadline: z.string().min(1).max(100).optional(),
    rewardXp: z.number().int().min(0).optional(),
    rewardMoney: z.number().int().min(0).optional(),
    status: z.enum(["active", "closed", "completed"]).optional(),
    description: z.string().optional(),
    requirements: z.array(z.string()).min(1).optional(),
  });

  static readonly CREATE_APPLICATION: ZodType = z.object({
    bountyId: z.string().uuid(),
    portfolioLinks: z.array(z.string().url()).min(1).max(3),
    cvImageUrl: z.string().url().max(500),
    whyHireYou: z.string().min(10),
  });

  static readonly UPDATE_APPLICATION: ZodType = z.object({
    portfolioLinks: z.array(z.string().url()).min(1).max(3).optional(),
    cvImageUrl: z.string().url().max(500).optional(),
    whyHireYou: z.string().min(10).optional(),
    status: z.enum(["pending", "accepted", "rejected"]).optional(),
  });
}

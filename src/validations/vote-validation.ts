import { z, ZodType } from "zod";

export class VoteValidation {
  static readonly CREATE_VOTE: ZodType = z.object({
    comment_id: z.number().positive(),
    vote_type: z.enum(["upvote", "downvote"]),
  });
}

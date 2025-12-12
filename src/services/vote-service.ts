import {
  CreateVoteRequest,
  VoteResponse,
} from "../models/vote-model";
import { prismaClient } from "../utils/database-util";
import { VoteValidation } from "../validations/vote-validation";
import { Validation } from "../validations/validation";
import { ResponseError } from "../error/response-error";

export class VoteService {
  static async addVote(request: CreateVoteRequest): Promise<VoteResponse> {
    const createRequest = Validation.validate(VoteValidation.CREATE_VOTE, request);

    // Check if comment exists
    const comment = await prismaClient.comment.findUnique({
      where: { id: createRequest.comment_id },
    });

    if (!comment) {
      throw new ResponseError(404, "Comment not found");
    }

    // Create vote
    const vote = await prismaClient.vote.create({
      data: {
        vote_type: createRequest.vote_type,
      },
    });

    // Link vote to comment
    await prismaClient.commentVote.create({
      data: {
        comment_id: createRequest.comment_id,
        vote_id: vote.id,
      },
    });

    return {
      id: vote.id,
      vote_type: vote.vote_type as "upvote" | "downvote",
      comment_id: createRequest.comment_id,
    };
  }

  static async removeVote(voteId: number): Promise<void> {
    const existingVote = await prismaClient.vote.findUnique({
      where: { id: voteId },
    });

    if (!existingVote) {
      throw new ResponseError(404, "Vote not found");
    }

    // Delete will cascade and remove from CommentVote table
    await prismaClient.vote.delete({
      where: { id: voteId },
    });
  }
}

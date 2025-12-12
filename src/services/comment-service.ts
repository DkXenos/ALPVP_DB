import {
  CommentResponse,
  CreateCommentRequest,
  UpdateCommentRequest,
} from "../models/comment-model";
import { prismaClient } from "../utils/database-util";
import { CommentValidation } from "../validations/comment-validation";
import { Validation } from "../validations/validation";
import { ResponseError } from "../error/response-error";

export class CommentService {
  static async createComment(request: CreateCommentRequest): Promise<CommentResponse> {
    const createRequest = Validation.validate(
      CommentValidation.CREATE_COMMENT,
      request
    );

    // Check if post exists
    const post = await prismaClient.post.findUnique({
      where: { id: createRequest.post_id },
    });

    if (!post) {
      throw new ResponseError(404, "Post not found");
    }

    const comment = await prismaClient.comment.create({
      data: {
        post_id: createRequest.post_id,
        content: createRequest.content,
      },
    });

    return {
      id: comment.id,
      post_id: comment.post_id,
      content: comment.content,
      created_at: comment.created_at,
      commentVotes: [],
    };
  }

  static async getCommentById(id: number): Promise<CommentResponse> {
    const comment = await prismaClient.comment.findUnique({
      where: { id },
      include: {
        commentVotes: {
          include: {
            vote: true,
          },
        },
      },
    });

    if (!comment) {
      throw new ResponseError(404, "Comment not found");
    }

    return {
      id: comment.id,
      post_id: comment.post_id,
      content: comment.content,
      created_at: comment.created_at,
      commentVotes: comment.commentVotes.map((cv) => ({
        id: cv.vote.id,
        vote_type: cv.vote.vote_type as "upvote" | "downvote",
        comment_id: comment.id,
      })),
    };
  }

  static async updateComment(
    id: number,
    request: UpdateCommentRequest
  ): Promise<CommentResponse> {
    const updateRequest = Validation.validate(
      CommentValidation.UPDATE_COMMENT,
      request
    );

    const existingComment = await prismaClient.comment.findUnique({
      where: { id },
      include: {
        commentVotes: {
          include: {
            vote: true,
          },
        },
      },
    });

    if (!existingComment) {
      throw new ResponseError(404, "Comment not found");
    }

    const comment = await prismaClient.comment.update({
      where: { id },
      data: updateRequest,
      include: {
        commentVotes: {
          include: {
            vote: true,
          },
        },
      },
    });

    return {
      id: comment.id,
      post_id: comment.post_id,
      content: comment.content,
      created_at: comment.created_at,
      commentVotes: comment.commentVotes.map((cv) => ({
        id: cv.vote.id,
        vote_type: cv.vote.vote_type as "upvote" | "downvote",
        comment_id: comment.id,
      })),
    };
  }

  static async deleteComment(id: number): Promise<void> {
    const existingComment = await prismaClient.comment.findUnique({
      where: { id },
    });

    if (!existingComment) {
      throw new ResponseError(404, "Comment not found");
    }

    await prismaClient.comment.delete({
      where: { id },
    });
  }

  static async getCommentsByPostId(postId: number): Promise<CommentResponse[]> {
    const comments = await prismaClient.comment.findMany({
      where: { post_id: postId },
      include: {
        commentVotes: {
          include: {
            vote: true,
          },
        },
      },
      orderBy: {
        created_at: "desc",
      },
    });

    return comments.map((comment) => {
      const upvotes = comment.commentVotes.filter(
        (cv) => cv.vote.vote_type === "upvote"
      ).length;
      const downvotes = comment.commentVotes.filter(
        (cv) => cv.vote.vote_type === "downvote"
      ).length;

      return {
        id: comment.id,
        post_id: comment.post_id,
        content: comment.content,
        created_at: comment.created_at,
        commentVotes: comment.commentVotes.map((cv) => ({
          id: cv.vote.id,
          vote_type: cv.vote.vote_type as "upvote" | "downvote",
          comment_id: comment.id,
        })),
      };
    });
  }
}

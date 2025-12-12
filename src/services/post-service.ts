import {
  CreatePostRequest,
  PostResponse,
  UpdatePostRequest,
} from "../models/post-model";
import { prismaClient } from "../utils/database-util";
import { PostValidation } from "../validations/post-validation";
import { Validation } from "../validations/validation";
import { ResponseError } from "../error/response-error";

export class PostService {
  static async createPost(request: CreatePostRequest): Promise<PostResponse> {
    const createRequest = Validation.validate(PostValidation.CREATE_POST, request);

    // Check if user exists
    const user = await prismaClient.user.findUnique({
      where: { id: createRequest.user_id },
    });

    if (!user) {
      throw new ResponseError(404, "User not found");
    }

    const post = await prismaClient.post.create({
      data: {
        user_id: createRequest.user_id,
        content: createRequest.content,
        image: createRequest.image || null,
      },
      include: {
        user: {
          select: {
            username: true,
          },
        },
      },
    });

    return {
      id: post.id,
      user_id: post.user_id,
      content: post.content,
      image: post.image,
      created_at: post.created_at,
      username: post.user.username,
    };
  }

  static async getAllPosts(): Promise<PostResponse[]> {
    const posts = await prismaClient.post.findMany({
      include: {
        user: {
          select: {
            username: true,
          },
        },
        comments: {
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
        },
      },
      orderBy: {
        created_at: "desc",
      },
    });

    return posts.map((post) => ({
      id: post.id,
      user_id: post.user_id,
      content: post.content,
      image: post.image,
      created_at: post.created_at,
      username: post.user.username,
      comments: post.comments.map((comment) => ({
        id: comment.id,
        post_id: comment.post_id,
        content: comment.content,
        created_at: comment.created_at,
        commentVotes: comment.commentVotes.map((cv) => ({
          id: cv.vote.id,
          vote_type: cv.vote.vote_type as "upvote" | "downvote",
          comment_id: comment.id,
        })),
      })),
    }));
  }

  static async getPostById(id: number): Promise<PostResponse> {
    const post = await prismaClient.post.findUnique({
      where: { id },
      include: {
        user: {
          select: {
            username: true,
          },
        },
        comments: {
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
        },
      },
    });

    if (!post) {
      throw new ResponseError(404, "Post not found");
    }

    return {
      id: post.id,
      user_id: post.user_id,
      content: post.content,
      image: post.image,
      created_at: post.created_at,
      username: post.user.username,
      comments: post.comments.map((comment) => ({
        id: comment.id,
        post_id: comment.post_id,
        content: comment.content,
        created_at: comment.created_at,
        commentVotes: comment.commentVotes.map((cv) => ({
          id: cv.vote.id,
          vote_type: cv.vote.vote_type as "upvote" | "downvote",
          comment_id: comment.id,
        })),
      })),
    };
  }

  static async updatePost(
    id: number,
    request: UpdatePostRequest
  ): Promise<PostResponse> {
    const updateRequest = Validation.validate(PostValidation.UPDATE_POST, request);

    const existingPost = await prismaClient.post.findUnique({
      where: { id },
    });

    if (!existingPost) {
      throw new ResponseError(404, "Post not found");
    }

    const post = await prismaClient.post.update({
      where: { id },
      data: updateRequest,
      include: {
        user: {
          select: {
            username: true,
          },
        },
      },
    });

    return {
      id: post.id,
      user_id: post.user_id,
      content: post.content,
      image: post.image,
      created_at: post.created_at,
      username: post.user.username,
    };
  }

  static async deletePost(id: number): Promise<void> {
    const existingPost = await prismaClient.post.findUnique({
      where: { id },
    });

    if (!existingPost) {
      throw new ResponseError(404, "Post not found");
    }

    await prismaClient.post.delete({
      where: { id },
    });
  }
}

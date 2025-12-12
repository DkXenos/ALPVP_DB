import { NextFunction, Request, Response } from "express";
import { CommentService } from "../services/comment-service";
import {
  CreateCommentRequest,
  UpdateCommentRequest,
} from "../models/comment-model";

export class CommentController {
  static async createComment(req: Request, res: Response, next: NextFunction) {
    try {
      const request: CreateCommentRequest = req.body;
      const response = await CommentService.createComment(request);
      res.status(201).json({
        data: response,
      });
    } catch (error) {
      next(error);
    }
  }

  static async getCommentById(req: Request, res: Response, next: NextFunction) {
    try {
      const id = parseInt(req.params.id);
      const response = await CommentService.getCommentById(id);
      res.status(200).json({
        data: response,
      });
    } catch (error) {
      next(error);
    }
  }

  static async updateComment(req: Request, res: Response, next: NextFunction) {
    try {
      const id = parseInt(req.params.id);
      const request: UpdateCommentRequest = req.body;
      const response = await CommentService.updateComment(id, request);
      res.status(200).json({
        data: response,
      });
    } catch (error) {
      next(error);
    }
  }

  static async deleteComment(req: Request, res: Response, next: NextFunction) {
    try {
      const id = parseInt(req.params.id);
      await CommentService.deleteComment(id);
      res.status(200).json({
        message: "Comment deleted successfully",
      });
    } catch (error) {
      next(error);
    }
  }

  static async getCommentsByPostId(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const postId = parseInt(req.params.postId);
      const response = await CommentService.getCommentsByPostId(postId);
      res.status(200).json({
        data: response,
      });
    } catch (error) {
      next(error);
    }
  }
}

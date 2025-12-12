import { NextFunction, Request, Response } from "express";
import { PostService } from "../services/post-service";
import {
  CreatePostRequest,
  UpdatePostRequest,
} from "../models/post-model";

export class PostController {
  static async createPost(req: Request, res: Response, next: NextFunction) {
    try {
      const request: CreatePostRequest = req.body;
      const response = await PostService.createPost(request);
      res.status(201).json({
        data: response,
      });
    } catch (error) {
      next(error);
    }
  }

  static async getAllPosts(req: Request, res: Response, next: NextFunction) {
    try {
      const response = await PostService.getAllPosts();
      res.status(200).json({
        data: response,
      });
    } catch (error) {
      next(error);
    }
  }

  static async getPostById(req: Request, res: Response, next: NextFunction) {
    try {
      const id = parseInt(req.params.id);
      const response = await PostService.getPostById(id);
      res.status(200).json({
        data: response,
      });
    } catch (error) {
      next(error);
    }
  }

  static async updatePost(req: Request, res: Response, next: NextFunction) {
    try {
      const id = parseInt(req.params.id);
      const request: UpdatePostRequest = req.body;
      const response = await PostService.updatePost(id, request);
      res.status(200).json({
        data: response,
      });
    } catch (error) {
      next(error);
    }
  }

  static async deletePost(req: Request, res: Response, next: NextFunction) {
    try {
      const id = parseInt(req.params.id);
      await PostService.deletePost(id);
      res.status(200).json({
        message: "Post deleted successfully",
      });
    } catch (error) {
      next(error);
    }
  }
}

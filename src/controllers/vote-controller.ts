import { NextFunction, Request, Response } from "express";
import { VoteService } from "../services/vote-service";
import { CreateVoteRequest } from "../models/vote-model";

export class VoteController {
  static async addVote(req: Request, res: Response, next: NextFunction) {
    try {
      const request: CreateVoteRequest = req.body;
      const response = await VoteService.addVote(request);
      res.status(201).json({
        data: response,
        message: "Vote added successfully",
      });
    } catch (error) {
      next(error);
    }
  }

  static async removeVote(req: Request, res: Response, next: NextFunction) {
    try {
      const voteId = parseInt(req.params.voteId);
      await VoteService.removeVote(voteId);
      res.status(200).json({
        message: "Vote removed successfully",
      });
    } catch (error) {
      next(error);
    }
  }

}


import { NextFunction, Request, Response } from "express";
import { BountyService } from "../services/bounty-service";
import { UserRequest } from "../models/user-request-model";

export class BountyController {
  static async getAllBounties(req: Request, res: Response, next: NextFunction) {
    try {
      const response = await BountyService.getAllBounties();
      res.status(200).json({
        data: response,
      });
    } catch (error) {
      next(error);
    }
  }

  static async getBountyById(req: Request, res: Response, next: NextFunction) {
    try {
      const id = req.params.id;
      const response = await BountyService.getBountyById(id);
      res.status(200).json({
        data: response,
      });
    } catch (error) {
      next(error);
    }
  }

  static async claimBounty(req: UserRequest, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.id;
      const bountyId = req.params.id;
      await BountyService.claimBounty(userId, bountyId);
      res.status(200).json({
        message: "Bounty claimed successfully",
      });
    } catch (error) {
      next(error);
    }
  }

  static async unclaimBounty(req: UserRequest, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.id;
      const bountyId = req.params.id;
      await BountyService.unclaimBounty(userId, bountyId);
      res.status(200).json({
        message: "Bounty unclaimed successfully",
      });
    } catch (error) {
      next(error);
    }
  }

  static async getMyBounties(req: UserRequest, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.id;
      const response = await BountyService.getMyBounties(userId);
      res.status(200).json({
        data: response,
      });
    } catch (error) {
      next(error);
    }
  }
}

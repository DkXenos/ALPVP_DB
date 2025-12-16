import { NextFunction, Request, Response } from "express";
import { BountyService } from "../services/bounty-service";
import { UserRequest } from "../models/user-request-model";
import { CreateBountyRequest } from "../models/bounty-model";

export class BountyController {
  static async getAllBounties(req: UserRequest, res: Response, next: NextFunction) {
    try {
      const userId = req.user?.id;
      const companyId = req.user?.type === "company" ? req.user.id : undefined;
      const response = await BountyService.getAllBounties(userId, companyId);
      res.status(200).json({
        data: response,
      });
    } catch (error) {
      next(error);
    }
  }

  static async getBountyById(req: UserRequest, res: Response, next: NextFunction) {
    try {
      const id = req.params.id;
      const userId = req.user?.id;
      const companyId = req.user?.type === "company" ? req.user.id : undefined;
      const response = await BountyService.getBountyById(id, userId, companyId);
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

  // Get applicants for a bounty (company only)
  static async getBountyApplicants(req: UserRequest, res: Response, next: NextFunction) {
    try {
      if (req.user?.type !== "company") {
        return res.status(403).json({
          errors: "Only companies can view applicants",
        });
      }

      const bountyId = req.params.id;
      const companyId = req.user.id;
      const response = await BountyService.getBountyApplicants(bountyId, companyId);
      res.status(200).json({
        data: response,
      });
    } catch (error) {
      next(error);
    }
  }

  // Get company's bounties
  static async getCompanyBounties(req: UserRequest, res: Response, next: NextFunction) {
    try {
      if (req.user?.type !== "company") {
        return res.status(403).json({
          errors: "Only companies can access this endpoint",
        });
      }

      const companyId = req.user.id;
      const response = await BountyService.getCompanyBounties(companyId);
      res.status(200).json({
        data: response,
      });
    } catch (error) {
      next(error);
    }
  }

  // Create bounty (company only)
  static async createBounty(req: UserRequest, res: Response, next: NextFunction) {
    try {
      if (req.user?.type !== "company") {
        return res.status(403).json({
          errors: "Only companies can create bounties",
        });
      }

      const companyId = req.user.id;
      const request: CreateBountyRequest = req.body;
      
      const response = await BountyService.createBounty(companyId, {
        title: request.title,
        description: request.description,
        deadline: new Date(request.deadline),
        rewardXp: request.rewardXp,
        rewardMoney: request.rewardMoney,
      });

      res.status(201).json({
        data: response,
      });
    } catch (error) {
      next(error);
    }
  }
}

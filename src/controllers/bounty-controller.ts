import { NextFunction, Request, Response } from "express";
import { BountyService } from "../services/bounty-service";
import { CreateBountyRequest, SubmitBountyRequest } from "../models/bounty-model";

export class BountyController {
  static async getAllBounties(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = (req as any).user?.id;
      const companyId = (req as any).company?.id;
      const response = await BountyService.getAllBounties(userId, companyId);
      res.status(200).json({ data: response });
    } catch (error) {
      next(error);
    }
  }

  static async getBountyById(req: Request, res: Response, next: NextFunction) {
    try {
      const id = req.params.id;
      const userId = (req as any).user?.id;
      const companyId = (req as any).company?.id;
      const response = await BountyService.getBountyById(id, userId, companyId);
      res.status(200).json({ data: response });
    } catch (error) {
      next(error);
    }
  }

  static async claimBounty(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = (req as any).user!.id;
      const bountyId = req.params.id;
      await BountyService.claimBounty(userId, bountyId);
      res.status(200).json({ message: "Bounty claimed successfully" });
    } catch (error) {
      next(error);
    }
  }

  static async unclaimBounty(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = (req as any).user!.id;
      const bountyId = req.params.id;
      await BountyService.unclaimBounty(userId, bountyId);
      res.status(200).json({ message: "Bounty unclaimed successfully" });
    } catch (error) {
      next(error);
    }
  }

  static async getMyBounties(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = (req as any).user!.id;
      const response = await BountyService.getMyBounties(userId);
      res.status(200).json({ data: response });
    } catch (error) {
      next(error);
    }
  }

  // Get applicants for a bounty (company only)
  static async getBountyApplicants(req: Request, res: Response, next: NextFunction) {
    try {
      if (!(req as any).company) {
        return res.status(403).json({ errors: "Only companies can view applicants" });
      }

      const bountyId = req.params.id;
      const companyId = (req as any).company.id;
      const response = await BountyService.getBountyApplicants(bountyId, companyId);
      res.status(200).json({ data: response });
    } catch (error) {
      next(error);
    }
  }

  // Get company's bounties
  static async getCompanyBounties(req: Request, res: Response, next: NextFunction) {
    try {
      if (!(req as any).company) {
        return res.status(403).json({ errors: "Only companies can access this endpoint" });
      }

      const companyId = (req as any).company.id;
      const response = await BountyService.getCompanyBounties(companyId);
      res.status(200).json({ data: response });
    } catch (error) {
      next(error);
    }
  }

  // Create bounty (company only)
  static async createBounty(req: Request, res: Response, next: NextFunction) {
    try {
      if (!(req as any).company) {
        return res.status(403).json({ errors: "Only companies can create bounties" });
      }

      const companyId = (req as any).company.id;
      const request: CreateBountyRequest = req.body;

      const response = await BountyService.createBounty(companyId, {
        title: request.title,
        description: request.description,
        deadline: new Date(request.deadline),
        rewardXp: request.rewardXp,
        rewardMoney: request.rewardMoney,
      });

      res.status(201).json({ data: response });
    } catch (error) {
      next(error);
    }
  }

  // Submit work for a bounty (user only)
  static async submitBounty(req: Request, res: Response, next: NextFunction) {
    try {
      if (!(req as any).user) {
        return res.status(403).json({ errors: "Only users can submit work" });
      }

      const userId = (req as any).user.id;
      const bountyId = req.params.id;
      const request: SubmitBountyRequest = req.body;

      await BountyService.submitBounty(userId, bountyId, {
        submissionUrl: request.submissionUrl,
        submissionNotes: request.submissionNotes,
      });

      res.status(200).json({ message: "Work submitted successfully" });
    } catch (error) {
      next(error);
    }
  }

  // Select winner for a bounty (company only)
  static async selectWinner(req: Request, res: Response, next: NextFunction) {
    try {
      if (!(req as any).company) {
        return res.status(403).json({ errors: "Only companies can select winners" });
      }

      const companyId = (req as any).company.id;
      const bountyId = req.params.id;
      const userId = parseInt(req.params.userId);

      if (isNaN(userId)) {
        return res.status(400).json({ errors: "Invalid user ID" });
      }

      await BountyService.selectWinner(companyId, bountyId, userId);

      res.status(200).json({ message: "Winner selected successfully and rewards have been distributed" });
    } catch (error) {
      next(error);
    }
  }
}
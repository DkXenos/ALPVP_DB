import { NextFunction, Request, Response } from "express";
import { BountyService } from "../services/bounty-service";
import {
  CreateBountyRequest,
  UpdateBountyRequest,
  CreateApplicationRequest,
  UpdateApplicationRequest,
} from "../models/bounty-model";

export class BountyController {
  // Bounty Controllers
  static async createBounty(req: Request, res: Response, next: NextFunction) {
    try {
      const request: CreateBountyRequest = req.body;
      const response = await BountyService.createBounty(request);
      res.status(201).json({
        data: response,
      });
    } catch (error) {
      next(error);
    }
  }

  static async getAllBounties(req: Request, res: Response, next: NextFunction) {
    try {
      const status = req.query.status as string | undefined;
      const type = req.query.type as string | undefined;
      const response = await BountyService.getAllBounties({ status, type });
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

  static async searchBounties(req: Request, res: Response, next: NextFunction) {
    try {
      const query = req.query.q as string;
      if (!query) {
        return res.status(400).json({
          error: "Query parameter 'q' is required",
        });
      }
      const response = await BountyService.searchBounties(query);
      res.status(200).json({
        data: response,
      });
    } catch (error) {
      next(error);
    }
  }

  static async updateBounty(req: Request, res: Response, next: NextFunction) {
    try {
      const id = req.params.id;
      const request: UpdateBountyRequest = req.body;
      const response = await BountyService.updateBounty(id, request);
      res.status(200).json({
        data: response,
      });
    } catch (error) {
      next(error);
    }
  }

  static async deleteBounty(req: Request, res: Response, next: NextFunction) {
    try {
      const id = req.params.id;
      await BountyService.deleteBounty(id);
      res.status(200).json({
        message: "Bounty deleted successfully",
      });
    } catch (error) {
      next(error);
    }
  }

  // Application Controllers
  static async applyToBounty(req: Request, res: Response, next: NextFunction) {
    try {
      const bountyId = req.params.id;
      const request: CreateApplicationRequest = {
        ...req.body,
        bountyId,
      };
      const response = await BountyService.createApplication(request);
      res.status(201).json({
        data: response,
      });
    } catch (error) {
      next(error);
    }
  }

  static async getAllApplications(req: Request, res: Response, next: NextFunction) {
    try {
      const response = await BountyService.getAllApplications();
      res.status(200).json({
        data: response,
      });
    } catch (error) {
      next(error);
    }
  }

  static async getApplicationById(req: Request, res: Response, next: NextFunction) {
    try {
      const id = req.params.id;
      const response = await BountyService.getApplicationById(id);
      res.status(200).json({
        data: response,
      });
    } catch (error) {
      next(error);
    }
  }

  static async updateApplication(req: Request, res: Response, next: NextFunction) {
    try {
      const id = req.params.id;
      const request: UpdateApplicationRequest = req.body;
      const response = await BountyService.updateApplication(id, request);
      res.status(200).json({
        data: response,
      });
    } catch (error) {
      next(error);
    }
  }

  static async deleteApplication(req: Request, res: Response, next: NextFunction) {
    try {
      const id = req.params.id;
      await BountyService.deleteApplication(id);
      res.status(200).json({
        message: "Application deleted successfully",
      });
    } catch (error) {
      next(error);
    }
  }
}

import { NextFunction, Request, Response } from "express";
import { BountyService } from "../services/bounty-service";

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
}

import { NextFunction, Request, Response } from "express";
import { CompanyService } from "../services/company-service";
import {
  CreateCompanyRequest,
  UpdateCompanyRequest,
} from "../models/company-model";

export class CompanyController {
  static async createCompany(req: Request, res: Response, next: NextFunction) {
    try {
      const request: CreateCompanyRequest = req.body;
      const response = await CompanyService.createCompany(request);
      res.status(201).json({
        data: response,
      });
    } catch (error) {
      next(error);
    }
  }

  static async getAllCompanies(req: Request, res: Response, next: NextFunction) {
    try {
      const response = await CompanyService.getAllCompanies();
      res.status(200).json({
        data: response,
      });
    } catch (error) {
      next(error);
    }
  }

  static async getCompanyById(req: Request, res: Response, next: NextFunction) {
    try {
      const id = parseInt(req.params.id);
      const response = await CompanyService.getCompanyById(id);
      res.status(200).json({
        data: response,
      });
    } catch (error) {
      next(error);
    }
  }

  static async updateCompany(req: Request, res: Response, next: NextFunction) {
    try {
      const id = parseInt(req.params.id);
      const request: UpdateCompanyRequest = req.body;
      const response = await CompanyService.updateCompany(id, request);
      res.status(200).json({
        data: response,
      });
    } catch (error) {
      next(error);
    }
  }

  static async deleteCompany(req: Request, res: Response, next: NextFunction) {
    try {
      const id = parseInt(req.params.id);
      await CompanyService.deleteCompany(id);
      res.status(200).json({
        message: "Company deleted successfully",
      });
    } catch (error) {
      next(error);
    }
  }
}

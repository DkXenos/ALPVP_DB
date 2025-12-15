import { NextFunction, Request, Response } from "express";
import { CompanyService } from "../services/company-service";
import {
  UpdateCompanyRequest,
  RegisterCompanyRequest,
  LoginCompanyRequest,
} from "../models/company-model";

export class CompanyController {
  static async register(req: Request, res: Response, next: NextFunction) {
    try {
      const request: RegisterCompanyRequest = req.body;
      const response = await CompanyService.register(request);
      res.status(201).json({
        data: response,
      });
    } catch (error) {
      next(error);
    }
  }

  static async login(req: Request, res: Response, next: NextFunction) {
    try {
      const request: LoginCompanyRequest = req.body;
      const response = await CompanyService.login(request);
      res.status(200).json({
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

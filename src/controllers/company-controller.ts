import { NextFunction, Request, Response } from "express";
import { CompanyService } from "../services/company-service";
import fs from "fs";
import path from "path";

import {
  UpdateCompanyRequest,
  RegisterCompanyRequest,
  LoginCompanyRequest,
} from "../models/company-model";
import { CompanyRequest } from "../models/company-request-model";


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
      
      // Build request object
      const request: UpdateCompanyRequest = {
        name: req.body.name,
        description: req.body.description,
        email: req.body.email,
      };

      // Handle logo upload if file is provided
      if (req.file) {
        request.logo = `/uploads/companies/${req.file.filename}`;
      }

      const response = await CompanyService.updateCompany(id, request);
      res.status(200).json({
        data: response,
      });
    } catch (error) {
      // If error occurs, delete uploaded file
      if (req.file) {
        const filePath = path.join(__dirname, "../../public/uploads/companies", req.file.filename);
        if (fs.existsSync(filePath)) {
          fs.unlinkSync(filePath);
        }
      }
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
  
  static async uploadLogo(req: CompanyRequest, res: Response, next: NextFunction) {
    try {
      if (!req.company) {
        return res.status(401).json({ errors: "Unauthorized" });
      }

      if (!req.file) {
        return res.status(400).json({ errors: "No file uploaded" });
      }

      const response = await CompanyService.uploadLogo(req.company.id, req.file.filename);
      res.status(200).json({ data: response });
    } catch (error) {
      // Delete uploaded file if error occurs
      if (req.file) {
        const filePath = path.join(__dirname, "../../public/uploads/companies", req.file.filename);
        if (fs.existsSync(filePath)) {
          fs.unlinkSync(filePath);
        }
      }
      next(error);
    }
  }

  static async deleteLogo(req: CompanyRequest, res: Response, next: NextFunction) {
    try {
      if (!req.company) {
        return res.status(401).json({ errors: "Unauthorized" });
      }

      const response = await CompanyService.deleteLogo(req.company.id);
      res.status(200).json({ data: response });
    } catch (error) {
      next(error);
    }
  }
}

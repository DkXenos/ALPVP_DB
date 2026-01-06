import {
  CompanyResponse,
  UpdateCompanyRequest,
  RegisterCompanyRequest,
  LoginCompanyRequest,
  CompanyAuthResponse,
} from "../models/company-model";
import { prismaClient } from "../utils/database-util";
import { CompanyValidation } from "../validations/company-validation";
import { Validation } from "../validations/validation";
import { ResponseError } from "../error/response-error";
import bcrypt from "bcrypt";
import { generateToken } from "../utils/jwt-util";

export class CompanyService {
  static async register(request: RegisterCompanyRequest): Promise<CompanyAuthResponse> {
    const registerRequest = Validation.validate(CompanyValidation.REGISTER_COMPANY, request);

    // Check if email already exists
    const existingCompany = await prismaClient.company.findUnique({
      where: { email: registerRequest.email },
    });

    if (existingCompany) {
      throw new ResponseError(400, "Company with this email already exists");
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(registerRequest.password, 10);

    // Create company with placeholder logo
    const company = await prismaClient.company.create({
      data: {
        name: registerRequest.name,
        email: registerRequest.email,
        password: hashedPassword,
        description: registerRequest.description || null,
        logo: "/uploads/companies/company_placeholder.png",
      },
    });

    // Generate token
    const token = generateToken(
      {
        id: company.id,
        email: company.email,
        name: company.name,
        type: "company",
      },
      "24h"
    );

    return {
      token,
      company: {
        id: company.id,
        name: company.name,
        email: company.email,
      },
    };
  }

  static async login(request: LoginCompanyRequest): Promise<CompanyAuthResponse> {
    const loginRequest = Validation.validate(CompanyValidation.LOGIN_COMPANY, request);

    // Find company by email
    const company = await prismaClient.company.findUnique({
      where: { email: loginRequest.email },
    });

    if (!company) {
      throw new ResponseError(401, "Invalid email or password");
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(loginRequest.password, company.password);

    if (!isPasswordValid) {
      throw new ResponseError(401, "Invalid email or password");
    }

    // Generate token
    const token = generateToken(
      {
        id: company.id,
        email: company.email,
        name: company.name,
        type: "company",
      },
      "24h"
    );

    return {
      token,
      company: {
        id: company.id,
        name: company.name,
        email: company.email,
      },
    };
  }

  // Note: company creation for auth is handled by `register` which creates
  // the company with a password and returns an auth token. The legacy
  // `createCompany` method was removed to avoid duplicate flows.

  static async getAllCompanies(): Promise<CompanyResponse[]> {
    const companies = await prismaClient.company.findMany({
      orderBy: {
        name: "asc",
      },
    });

    return companies.map((company) => ({
      id: company.id,
      name: company.name,
      description: company.description,
      email: company.email,
      logo: company.logo,
      created_at: company.created_at,
    }));
  }

  static async getCompanyById(id: number): Promise<CompanyResponse> {
    const company = await prismaClient.company.findUnique({
      where: { id },
    });

    if (!company) {
      throw new ResponseError(404, "Company not found");
    }

    return {
      id: company.id,
      name: company.name,
      description: company.description,
      email: company.email,
      logo: company.logo,
      created_at: company.created_at,
    };
  }

  static async updateCompany(id: number, request: UpdateCompanyRequest): Promise<CompanyResponse> {
    const updateRequest = Validation.validate(CompanyValidation.UPDATE_COMPANY, request);

    // Check if company exists
    const existingCompany = await prismaClient.company.findUnique({
      where: { id },
    });

    if (!existingCompany) {
      throw new ResponseError(404, "Company not found");
    }

    // Check if email is being changed and if it already exists
    if (updateRequest.email && updateRequest.email !== existingCompany.email) {
      const emailExists = await prismaClient.company.findUnique({
        where: { email: updateRequest.email },
      });

      if (emailExists) {
        throw new ResponseError(400, "Company with this email already exists");
      }
    }

    const company = await prismaClient.company.update({
      where: { id },
      data: {
        name: updateRequest.name,
        description: updateRequest.description,
        email: updateRequest.email,
        logo: updateRequest.logo,
      },
    });

    return {
      id: company.id,
      name: company.name,
      description: company.description,
      email: company.email,
      logo: company.logo,
      created_at: company.created_at,
    };
  }

  static async deleteCompany(id: number): Promise<void> {
    const company = await prismaClient.company.findUnique({
      where: { id },
    });

    if (!company) {
      throw new ResponseError(404, "Company not found");
    }

    await prismaClient.company.delete({
      where: { id },
    });
  }

  static async uploadLogo(companyId: number, filename: string): Promise<{ logo: string }> {
    // Get existing company to delete old logo if exists
    const company = await prismaClient.company.findUnique({
      where: { id: companyId },
    });

    if (!company) {
      throw new ResponseError(404, "Company not found");
    }

    // Delete old logo file if exists and not placeholder
    if (company.logo && !company.logo.includes("placeholder")) {
      const fs = await import("fs");
      const path = await import("path");
      const oldPath = path.join(__dirname, "../../public", company.logo);
      if (fs.existsSync(oldPath)) {
        fs.unlinkSync(oldPath);
      }
    }

    // Update company with new logo path
    const logoUrl = `/uploads/companies/${filename}`;
    await prismaClient.company.update({
      where: { id: companyId },
      data: { logo: logoUrl },
    });

    return { logo: logoUrl };
  }

  static async deleteLogo(companyId: number): Promise<{ logo: string }> {
    const company = await prismaClient.company.findUnique({
      where: { id: companyId },
    });

    if (!company) {
      throw new ResponseError(404, "Company not found");
    }

    // Delete logo file if exists
    if (company.logo && !company.logo.includes("placeholder")) {
      const fs = await import("fs");
      const path = await import("path");
      const logoPath = path.join(__dirname, "../../public", company.logo);
      if (fs.existsSync(logoPath)) {
        fs.unlinkSync(logoPath);
      }
    }

    // Update company to placeholder
    const defaultLogo = "/uploads/companies/company_placeholder.png";
    await prismaClient.company.update({
      where: { id: companyId },
      data: { logo: defaultLogo },
    });

    return { logo: defaultLogo };
  }
}

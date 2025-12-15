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

    // Create company
    const company = await prismaClient.company.create({
      data: {
        name: registerRequest.name,
        email: registerRequest.email,
        password: hashedPassword,
        description: registerRequest.description || null,
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
      },
    });

    return {
      id: company.id,
      name: company.name,
      description: company.description,
      email: company.email,
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
}

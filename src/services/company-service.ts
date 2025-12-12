import {
  CreateCompanyRequest,
  CompanyResponse,
  UpdateCompanyRequest,
} from "../models/company-model";
import { prismaClient } from "../utils/database-util";
import { CompanyValidation } from "../validations/company-validation";
import { Validation } from "../validations/validation";
import { ResponseError } from "../error/response-error";

export class CompanyService {
  static async createCompany(request: CreateCompanyRequest): Promise<CompanyResponse> {
    const createRequest = Validation.validate(CompanyValidation.CREATE_COMPANY, request);

    // Check if email already exists
    const existingCompany = await prismaClient.company.findUnique({
      where: { email: createRequest.email },
    });

    if (existingCompany) {
      throw new ResponseError(400, "Company with this email already exists");
    }

    const company = await prismaClient.company.create({
      data: {
        name: createRequest.name,
        description: createRequest.description || null,
        email: createRequest.email,
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

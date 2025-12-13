import {
  CreateBountyRequest,
  BountyResponse,
  UpdateBountyRequest,
  CreateApplicationRequest,
  ApplicationResponse,
  UpdateApplicationRequest,
} from "../models/bounty-model";
import { prismaClient } from "../utils/database-util";
import { BountyValidation } from "../validations/bounty-validation";
import { Validation } from "../validations/validation";
import { ResponseError } from "../error/response-error";

export class BountyService {
  // Bounty Services
  static async createBounty(request: CreateBountyRequest): Promise<BountyResponse> {
    const createRequest = Validation.validate(BountyValidation.CREATE_BOUNTY, request);

    const bounty = await prismaClient.bounty.create({
      data: {
        title: createRequest.title,
        company: createRequest.company,
        deadline: createRequest.deadline,
        rewardXp: createRequest.rewardXp,
        rewardMoney: createRequest.rewardMoney,
        description: createRequest.description || null,
        requirements: createRequest.requirements,
      },
    });

    return {
      id: bounty.id,
      title: bounty.title,
      company: bounty.company,
      deadline: bounty.deadline,
      rewardXp: bounty.rewardXp,
      rewardMoney: bounty.rewardMoney,
      status: bounty.status,
      description: bounty.description,
      requirements: bounty.requirements,
      createdAt: bounty.createdAt,
      updatedAt: bounty.updatedAt,
    };
  }

  static async getAllBounties(filters?: { status?: string; type?: string }): Promise<BountyResponse[]> {
    const where: any = {};

    if (filters?.status) {
      where.status = filters.status;
    }

    const bounties = await prismaClient.bounty.findMany({
      where,
      orderBy: {
        createdAt: "desc",
      },
      include: {
        _count: {
          select: { applications: true },
        },
      },
    });

    return bounties.map((bounty) => ({
      id: bounty.id,
      title: bounty.title,
      company: bounty.company,
      deadline: bounty.deadline,
      rewardXp: bounty.rewardXp,
      rewardMoney: bounty.rewardMoney,
      status: bounty.status,
      description: bounty.description,
      requirements: bounty.requirements,
      createdAt: bounty.createdAt,
      updatedAt: bounty.updatedAt,
      applicationCount: bounty._count.applications,
    }));
  }

  static async getBountyById(id: string): Promise<BountyResponse> {
    const bounty = await prismaClient.bounty.findUnique({
      where: { id },
      include: {
        _count: {
          select: { applications: true },
        },
      },
    });

    if (!bounty) {
      throw new ResponseError(404, "Bounty not found");
    }

    return {
      id: bounty.id,
      title: bounty.title,
      company: bounty.company,
      deadline: bounty.deadline,
      rewardXp: bounty.rewardXp,
      rewardMoney: bounty.rewardMoney,
      status: bounty.status,
      description: bounty.description,
      requirements: bounty.requirements,
      createdAt: bounty.createdAt,
      updatedAt: bounty.updatedAt,
      applicationCount: bounty._count.applications,
    };
  }

  static async searchBounties(query: string): Promise<BountyResponse[]> {
    const bounties = await prismaClient.bounty.findMany({
      where: {
        OR: [
          {
            title: {
              contains: query,
              mode: "insensitive",
            },
          },
          {
            company: {
              contains: query,
              mode: "insensitive",
            },
          },
          {
            description: {
              contains: query,
              mode: "insensitive",
            },
          },
        ],
      },
      orderBy: {
        createdAt: "desc",
      },
      include: {
        _count: {
          select: { applications: true },
        },
      },
    });

    return bounties.map((bounty) => ({
      id: bounty.id,
      title: bounty.title,
      company: bounty.company,
      deadline: bounty.deadline,
      rewardXp: bounty.rewardXp,
      rewardMoney: bounty.rewardMoney,
      status: bounty.status,
      description: bounty.description,
      requirements: bounty.requirements,
      createdAt: bounty.createdAt,
      updatedAt: bounty.updatedAt,
      applicationCount: bounty._count.applications,
    }));
  }

  static async updateBounty(id: string, request: UpdateBountyRequest): Promise<BountyResponse> {
    const updateRequest = Validation.validate(BountyValidation.UPDATE_BOUNTY, request);

    const existingBounty = await prismaClient.bounty.findUnique({
      where: { id },
    });

    if (!existingBounty) {
      throw new ResponseError(404, "Bounty not found");
    }

    const bounty = await prismaClient.bounty.update({
      where: { id },
      data: updateRequest,
    });

    return {
      id: bounty.id,
      title: bounty.title,
      company: bounty.company,
      deadline: bounty.deadline,
      rewardXp: bounty.rewardXp,
      rewardMoney: bounty.rewardMoney,
      status: bounty.status,
      description: bounty.description,
      requirements: bounty.requirements,
      createdAt: bounty.createdAt,
      updatedAt: bounty.updatedAt,
    };
  }

  static async deleteBounty(id: string): Promise<void> {
    const bounty = await prismaClient.bounty.findUnique({
      where: { id },
    });

    if (!bounty) {
      throw new ResponseError(404, "Bounty not found");
    }

    await prismaClient.bounty.delete({
      where: { id },
    });
  }

  // Application Services
  static async createApplication(request: CreateApplicationRequest): Promise<ApplicationResponse> {
    const createRequest = Validation.validate(BountyValidation.CREATE_APPLICATION, request);

    // Check if bounty exists
    const bounty = await prismaClient.bounty.findUnique({
      where: { id: createRequest.bountyId },
    });

    if (!bounty) {
      throw new ResponseError(404, "Bounty not found");
    }

    if (bounty.status !== "active") {
      throw new ResponseError(400, "This bounty is no longer accepting applications");
    }

    const application = await prismaClient.application.create({
      data: {
        bountyId: createRequest.bountyId,
        portfolioLinks: createRequest.portfolioLinks,
        cvImageUrl: createRequest.cvImageUrl,
        whyHireYou: createRequest.whyHireYou,
      },
      include: {
        bounty: true,
      },
    });

    return {
      id: application.id,
      bountyId: application.bountyId,
      portfolioLinks: application.portfolioLinks,
      cvImageUrl: application.cvImageUrl,
      whyHireYou: application.whyHireYou,
      status: application.status,
      submittedAt: application.submittedAt,
      bounty: {
        id: application.bounty.id,
        title: application.bounty.title,
        company: application.bounty.company,
        deadline: application.bounty.deadline,
        rewardXp: application.bounty.rewardXp,
        rewardMoney: application.bounty.rewardMoney,
      },
    };
  }

  static async getAllApplications(): Promise<ApplicationResponse[]> {
    const applications = await prismaClient.application.findMany({
      orderBy: {
        submittedAt: "desc",
      },
      include: {
        bounty: true,
      },
    });

    return applications.map((application) => ({
      id: application.id,
      bountyId: application.bountyId,
      portfolioLinks: application.portfolioLinks,
      cvImageUrl: application.cvImageUrl,
      whyHireYou: application.whyHireYou,
      status: application.status,
      submittedAt: application.submittedAt,
      bounty: {
        id: application.bounty.id,
        title: application.bounty.title,
        company: application.bounty.company,
        deadline: application.bounty.deadline,
        rewardXp: application.bounty.rewardXp,
        rewardMoney: application.bounty.rewardMoney,
      },
    }));
  }

  static async getApplicationById(id: string): Promise<ApplicationResponse> {
    const application = await prismaClient.application.findUnique({
      where: { id },
      include: {
        bounty: true,
      },
    });

    if (!application) {
      throw new ResponseError(404, "Application not found");
    }

    return {
      id: application.id,
      bountyId: application.bountyId,
      portfolioLinks: application.portfolioLinks,
      cvImageUrl: application.cvImageUrl,
      whyHireYou: application.whyHireYou,
      status: application.status,
      submittedAt: application.submittedAt,
      bounty: {
        id: application.bounty.id,
        title: application.bounty.title,
        company: application.bounty.company,
        deadline: application.bounty.deadline,
        rewardXp: application.bounty.rewardXp,
        rewardMoney: application.bounty.rewardMoney,
      },
    };
  }

  static async updateApplication(id: string, request: UpdateApplicationRequest): Promise<ApplicationResponse> {
    const updateRequest = Validation.validate(BountyValidation.UPDATE_APPLICATION, request);

    const existingApplication = await prismaClient.application.findUnique({
      where: { id },
    });

    if (!existingApplication) {
      throw new ResponseError(404, "Application not found");
    }

    const application = await prismaClient.application.update({
      where: { id },
      data: updateRequest,
      include: {
        bounty: true,
      },
    });

    return {
      id: application.id,
      bountyId: application.bountyId,
      portfolioLinks: application.portfolioLinks,
      cvImageUrl: application.cvImageUrl,
      whyHireYou: application.whyHireYou,
      status: application.status,
      submittedAt: application.submittedAt,
      bounty: {
        id: application.bounty.id,
        title: application.bounty.title,
        company: application.bounty.company,
        deadline: application.bounty.deadline,
        rewardXp: application.bounty.rewardXp,
        rewardMoney: application.bounty.rewardMoney,
      },
    };
  }

  static async deleteApplication(id: string): Promise<void> {
    const application = await prismaClient.application.findUnique({
      where: { id },
    });

    if (!application) {
      throw new ResponseError(404, "Application not found");
    }

    await prismaClient.application.delete({
      where: { id },
    });
  }
}

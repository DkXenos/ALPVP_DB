import { BountyResponse, AssignedBountyResponse } from "../models/bounty-model";
import { prismaClient } from "../utils/database-util";
import { ResponseError } from "../error/response-error";

export class BountyService {
  static async getAllBounties(userId?: number, companyId?: number): Promise<BountyResponse[]> {
    const bounties = await prismaClient.bounty.findMany({
      include: {
        company: {
          select: {
            id: true,
            name: true,
          },
        },
      },
      orderBy: {
        deadline: "asc",
      },
    });

    return bounties.map((bounty) => ({
      id: bounty.id,
      title: bounty.title,
      company: bounty.company.name,
      companyId: bounty.company.id,
      description: bounty.description || undefined,
      deadline: bounty.deadline.toISOString(),
      rewardXp: bounty.rewardXp,
      rewardMoney: bounty.rewardMoney,
      status: bounty.status,
      isOwner: companyId ? bounty.company_id === companyId : false,
    }));
  }

  static async getBountyById(id: string, userId?: number, companyId?: number): Promise<BountyResponse> {
    const bounty = await prismaClient.bounty.findUnique({
      where: { id },
      include: {
        company: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    if (!bounty) {
      throw new ResponseError(404, "Bounty not found");
    }

    return {
      id: bounty.id,
      title: bounty.title,
      company: bounty.company.name,
      companyId: bounty.company.id,
      description: bounty.description || undefined,
      deadline: bounty.deadline.toISOString(),
      rewardXp: bounty.rewardXp,
      rewardMoney: bounty.rewardMoney,
      status: bounty.status,
      isOwner: companyId ? bounty.company_id === companyId : false,
    };
  }

  static async claimBounty(userId: number, bountyId: string): Promise<void> {
    // Check if bounty exists
    const bounty = await prismaClient.bounty.findUnique({
      where: { id: bountyId },
    });

    if (!bounty) {
      throw new ResponseError(404, "Bounty not found");
    }

    // Check if already claimed
    const existing = await prismaClient.bountyAssignment.findUnique({
      where: {
        user_id_bounty_id: {
          user_id: userId,
          bounty_id: bountyId,
        },
      },
    });

    if (existing) {
      throw new ResponseError(400, "You have already claimed this bounty");
    }

    // Create assignment
    await prismaClient.bountyAssignment.create({
      data: {
        user_id: userId,
        bounty_id: bountyId,
      },
    });
  }

  static async unclaimBounty(userId: number, bountyId: string): Promise<void> {
    // Check if assignment exists
    const assignment = await prismaClient.bountyAssignment.findUnique({
      where: {
        user_id_bounty_id: {
          user_id: userId,
          bounty_id: bountyId,
        },
      },
    });

    if (!assignment) {
      throw new ResponseError(404, "Bounty assignment not found");
    }

    // Delete assignment (bounty itself is not deleted)
    await prismaClient.bountyAssignment.delete({
      where: {
        user_id_bounty_id: {
          user_id: userId,
          bounty_id: bountyId,
        },
      },
    });
  }

  static async getMyBounties(userId: number): Promise<AssignedBountyResponse[]> {
    const assignments = await prismaClient.bountyAssignment.findMany({
      where: { user_id: userId },
      include: {
        bounty: {
          include: {
            company: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        },
      },
      orderBy: {
        assigned_at: "desc",
      },
    });

    return assignments.map((assignment) => ({
      id: assignment.bounty.id,
      title: assignment.bounty.title,
      company: assignment.bounty.company.name,
      companyId: assignment.bounty.company.id,
      description: assignment.bounty.description || undefined,
      deadline: assignment.bounty.deadline.toISOString(),
      rewardXp: assignment.bounty.rewardXp,
      rewardMoney: assignment.bounty.rewardMoney,
      status: assignment.bounty.status,
      assignedAt: assignment.assigned_at.toISOString(),
      isCompleted: assignment.is_completed,
      completedAt: assignment.completed_at ? assignment.completed_at.toISOString() : null,
      submissionUrl: assignment.submission_url,
      submissionNotes: assignment.submission_notes,
      isWinner: assignment.is_winner,
    }));
  }

  // Get applicants for a bounty (company only)
  static async getBountyApplicants(bountyId: string, companyId: number) {
    // Check if bounty exists and belongs to company
    const bounty = await prismaClient.bounty.findUnique({
      where: { id: bountyId },
    });

    if (!bounty) {
      throw new ResponseError(404, "Bounty not found");
    }

    if (bounty.company_id !== companyId) {
      throw new ResponseError(403, "You don't have permission to view applicants for this bounty");
    }

    // Get all users who claimed this bounty
    const assignments = await prismaClient.bountyAssignment.findMany({
      where: { bounty_id: bountyId },
      include: {
        user: {
          select: {
            id: true,
            username: true,
            email: true,
            role: true,
          },
        },
      },
      orderBy: {
        assigned_at: "desc",
      },
    });

    return assignments.map((assignment) => ({
      user: {
        id: assignment.user.id,
        username: assignment.user.username,
        email: assignment.user.email,
        role: assignment.user.role,
      },
      assignedAt: assignment.assigned_at.toISOString(),
      isCompleted: assignment.is_completed,
      completedAt: assignment.completed_at ? assignment.completed_at.toISOString() : null,
      submissionUrl: assignment.submission_url,
      submissionNotes: assignment.submission_notes,
      isWinner: assignment.is_winner,
    }));
  }

  // Get company's bounties
  static async getCompanyBounties(companyId: number): Promise<BountyResponse[]> {
    const bounties = await prismaClient.bounty.findMany({
      where: { company_id: companyId },
      include: {
        company: {
          select: {
            id: true,
            name: true,
          },
        },
        bountyAssignments: true,
      },
      orderBy: {
        created_at: "desc",
      },
    });

    return bounties.map((bounty) => ({
      id: bounty.id,
      title: bounty.title,
      company: bounty.company.name,
      companyId: bounty.company.id,
      description: bounty.description || undefined,
      deadline: bounty.deadline.toISOString(),
      rewardXp: bounty.rewardXp,
      rewardMoney: bounty.rewardMoney,
      status: bounty.status,
      isOwner: true,
      applicantsCount: bounty.bountyAssignments.length,
    }));
  }

  // Create bounty (company only)
  static async createBounty(
    companyId: number,
    data: {
      title: string;
      description?: string;
      deadline: Date;
      rewardXp: number;
      rewardMoney: number;
    }
  ): Promise<BountyResponse> {
    const bounty = await prismaClient.bounty.create({
      data: {
        title: data.title,
        description: data.description,
        company_id: companyId,
        deadline: data.deadline,
        rewardXp: data.rewardXp,
        rewardMoney: data.rewardMoney,
        status: "OPEN",
      },
      include: {
        company: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    return {
      id: bounty.id,
      title: bounty.title,
      company: bounty.company.name,
      companyId: bounty.company.id,
      description: bounty.description || undefined,
      deadline: bounty.deadline.toISOString(),
      rewardXp: bounty.rewardXp,
      rewardMoney: bounty.rewardMoney,
      status: bounty.status,
      isOwner: true,
    };
  }

  // Submit work for a bounty (user only)
  static async submitBounty(
    userId: number,
    bountyId: string,
    data: {
      submissionUrl: string;
      submissionNotes?: string;
    }
  ): Promise<void> {
    // Check if assignment exists
    const assignment = await prismaClient.bountyAssignment.findUnique({
      where: {
        user_id_bounty_id: {
          user_id: userId,
          bounty_id: bountyId,
        },
      },
    });

    if (!assignment) {
      throw new ResponseError(404, "You have not claimed this bounty");
    }

    if (assignment.is_winner) {
      throw new ResponseError(400, "This bounty has already been completed with a winner");
    }

    // Update assignment with submission
    await prismaClient.bountyAssignment.update({
      where: {
        user_id_bounty_id: {
          user_id: userId,
          bounty_id: bountyId,
        },
      },
      data: {
        submission_url: data.submissionUrl,
        submission_notes: data.submissionNotes,
      },
    });
  }

  // Select winner for a bounty (company only)
  static async selectWinner(
    companyId: number,
    bountyId: string,
    winnerId: number
  ): Promise<void> {
    // Check if bounty exists and belongs to company
    const bounty = await prismaClient.bounty.findUnique({
      where: { id: bountyId },
    });

    if (!bounty) {
      throw new ResponseError(404, "Bounty not found");
    }

    if (bounty.company_id !== companyId) {
      throw new ResponseError(403, "You don't have permission to select a winner for this bounty");
    }

    if (bounty.status === "COMPLETED") {
      throw new ResponseError(400, "This bounty has already been completed");
    }

    // Check if winner has claimed the bounty
    const assignment = await prismaClient.bountyAssignment.findUnique({
      where: {
        user_id_bounty_id: {
          user_id: winnerId,
          bounty_id: bountyId,
        },
      },
    });

    if (!assignment) {
      throw new ResponseError(404, "This user has not claimed the bounty");
    }

    if (!assignment.submission_url) {
      throw new ResponseError(400, "This user has not submitted their work yet");
    }

    // Use transaction to ensure atomic updates
    await prismaClient.$transaction([
      // Mark assignment as winner and completed
      prismaClient.bountyAssignment.update({
        where: {
          user_id_bounty_id: {
            user_id: winnerId,
            bounty_id: bountyId,
          },
        },
        data: {
          is_winner: true,
          is_completed: true,
          completed_at: new Date(),
        },
      }),
      // Update bounty status and winner
      prismaClient.bounty.update({
        where: { id: bountyId },
        data: {
          status: "COMPLETED",
          winner_id: winnerId,
        },
      }),
      // Add rewards to user
      prismaClient.user.update({
        where: { id: winnerId },
        data: {
          xp: {
            increment: bounty.rewardXp,
          },
          balance: {
            increment: bounty.rewardMoney,
          },
        },
      }),
    ]);
  }}